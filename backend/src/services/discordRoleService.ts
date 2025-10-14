import axios from 'axios';

interface RoleAssignmentRequest {
  discordId: string;
  roleId: string;
  action: 'add' | 'remove';
}

interface DiscordRoleResponse {
  success: boolean;
  action?: string;
  discordId?: string;
  roleId?: string;
  error?: string;
}

class DiscordRoleService {
  private discordBotUrl: string;
  private timeout: number;

  constructor() {
    this.discordBotUrl = process.env.DISCORD_BOT_API_URL || 'http://localhost:5000';
    this.timeout = 5000; // 5 second timeout
  }

  /**
   * Assign a Discord role to a user
   */
  async assignRole(discordId: string, roleId: string): Promise<boolean> {
    try {
      const response = await axios.post<DiscordRoleResponse>(
        `${this.discordBotUrl}/api/discord/assign-role`,
        {
          discordId,
          roleId,
          action: 'add'
        },
        {
          timeout: this.timeout,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        console.log(`✅ Discord role ${roleId} assigned to user ${discordId}`);
        return true;
      } else {
        console.warn(`⚠️ Discord role assignment failed: ${response.data.error || 'Unknown error'}`);
        return false;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNREFUSED') {
          console.warn('⚠️ Discord bot is not running or unreachable');
        } else if (error.code === 'ECONNABORTED') {
          console.warn('⚠️ Discord bot request timed out');
        } else {
          console.error('❌ Discord role assignment error:', error.response?.data || error.message);
        }
      } else {
        console.error('❌ Unexpected error during Discord role assignment:', error);
      }
      return false;
    }
  }

  /**
   * Remove a Discord role from a user
   */
  async removeRole(discordId: string, roleId: string): Promise<boolean> {
    try {
      const response = await axios.post<DiscordRoleResponse>(
        `${this.discordBotUrl}/api/discord/assign-role`,
        {
          discordId,
          roleId,
          action: 'remove'
        },
        {
          timeout: this.timeout,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        console.log(`✅ Discord role ${roleId} removed from user ${discordId}`);
        return true;
      } else {
        console.warn(`⚠️ Discord role removal failed: ${response.data.error || 'Unknown error'}`);
        return false;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNREFUSED') {
          console.warn('⚠️ Discord bot is not running or unreachable');
        } else if (error.code === 'ECONNABORTED') {
          console.warn('⚠️ Discord bot request timed out');
        } else {
          console.error('❌ Discord role removal error:', error.response?.data || error.message);
        }
      } else {
        console.error('❌ Unexpected error during Discord role removal:', error);
      }
      return false;
    }
  }

  /**
   * Assign Discord role based on event configuration and user role
   * Uses event-specific Discord role IDs configured by event creators
   */
  async assignEventBasedRole(discordId: string, eventData: any, sideId: string, roleName: string): Promise<boolean> {
    // Find the side in the event data
    const sides = Array.isArray(eventData.sides) ? eventData.sides : JSON.parse(eventData.groups || '[]');
    const side = sides.find((s: any) => s.id === sideId);
    
    if (!side) {
      console.warn(`⚠️ Side ${sideId} not found in event`);
      return false;
    }

    // Determine if this is a leadership role
    const isLeadershipRole = this.isLeadershipRole(roleName);
    
    // Choose appropriate Discord role ID
    let roleId = '';
    
    if (isLeadershipRole && side.discordLeaderRoleId) {
      roleId = side.discordLeaderRoleId;
      console.log(`🎖️ Assigning leadership role for side "${side.name}": ${roleId}`);
    } else if (side.discordRoleId) {
      roleId = side.discordRoleId;
      console.log(`👥 Assigning side role for side "${side.name}": ${roleId}`);
    } else {
      // No Discord role configured for this side - skip assignment
      console.log(`ℹ️ No Discord role configured for side "${side.name}" - skipping role assignment`);
      return true; // Return true to indicate successful "no-op"
    }
    
    if (!roleId) {
      console.warn(`⚠️ No Discord role configured for side "${side.name}"`);
      return false;
    }

    return this.assignRole(discordId, roleId);
  }

  /**
   * Remove Discord role based on event configuration and user role
   */
  async removeEventBasedRole(discordId: string, eventData: any, sideId: string, roleName: string): Promise<boolean> {
    // Find the side in the event data
    const sides = Array.isArray(eventData.sides) ? eventData.sides : JSON.parse(eventData.groups || '[]');
    const side = sides.find((s: any) => s.id === sideId);
    
    if (!side) {
      console.warn(`⚠️ Side ${sideId} not found in event`);
      return false;
    }

    // Determine if this is a leadership role
    const isLeadershipRole = this.isLeadershipRole(roleName);
    
    // Choose appropriate Discord role ID to remove
    let roleId = '';
    
    if (isLeadershipRole && side.discordLeaderRoleId) {
      roleId = side.discordLeaderRoleId;
      console.log(`🎖️ Removing leadership role for side "${side.name}": ${roleId}`);
    } else if (side.discordRoleId) {
      roleId = side.discordRoleId;
      console.log(`👥 Removing side role for side "${side.name}": ${roleId}`);
    } else {
      // No Discord role configured for this side - skip removal
      console.log(`ℹ️ No Discord role configured for side "${side.name}" - skipping role removal`);
      return true; // Return true to indicate successful "no-op"
    }
    
    if (!roleId) {
      console.warn(`⚠️ No Discord role configured for side "${side.name}"`);
      return false;
    }

    return this.removeRole(discordId, roleId);
  }

  /**
   * Remove all Discord roles for a user when they unslot from an event
   * This removes both the side role and leader role (if configured)
   */
  async removeAllEventRoles(discordId: string, eventData: any, sideId: string): Promise<boolean> {
    // Find the side in the event data
    const sides = Array.isArray(eventData.sides) ? eventData.sides : JSON.parse(eventData.groups || '[]');
    const side = sides.find((s: any) => s.id === sideId);
    
    if (!side) {
      console.warn(`⚠️ Side ${sideId} not found in event`);
      return false;
    }

    let allRemoved = true;

    // Remove side role if configured
    if (side.discordRoleId) {
      console.log(`👥 Removing side role for side "${side.name}": ${side.discordRoleId}`);
      const sideRoleRemoved = await this.removeRole(discordId, side.discordRoleId);
      if (!sideRoleRemoved) {
        console.warn(`⚠️ Failed to remove side role ${side.discordRoleId}`);
        allRemoved = false;
      }
    }

    // Remove leader role if configured
    if (side.discordLeaderRoleId) {
      console.log(`🎖️ Removing leadership role for side "${side.name}": ${side.discordLeaderRoleId}`);
      const leaderRoleRemoved = await this.removeRole(discordId, side.discordLeaderRoleId);
      if (!leaderRoleRemoved) {
        console.warn(`⚠️ Failed to remove leader role ${side.discordLeaderRoleId}`);
        allRemoved = false;
      }
    }

    if (!side.discordRoleId && !side.discordLeaderRoleId) {
      console.log(`ℹ️ No Discord roles configured for side "${side.name}" - skipping role removal`);
      return true; // Return true to indicate successful "no-op"
    }

    return allRemoved;
  }

  /**
   * Determine if a role name indicates a leadership position
   */
  private isLeadershipRole(roleName: string): boolean {
    const lowerRoleName = roleName.toLowerCase();
    const leadershipKeywords = [
      'leader', 'commander', 'captain', 'lieutenant', 'sergeant', 'corporal',
      'chief', 'officer', 'lead', 'head', 'co', 'deputy', 'senior'
    ];
    
    return leadershipKeywords.some(keyword => lowerRoleName.includes(keyword));
  }

  /**
   * Check if Discord bot is available
   */
  async isDiscordBotAvailable(): Promise<boolean> {
    try {
      const response = await axios.get(`${this.discordBotUrl}/health`, {
        timeout: 2000
      });
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }

  /**
   * Check if a user is a member of the Discord server
   */
  async isUserInDiscordServer(discordId: string): Promise<boolean> {
    try {
      const response = await axios.get(
        `${this.discordBotUrl}/api/discord/check-member/${discordId}`,
        {
          timeout: this.timeout,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.isMember === true;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNREFUSED') {
          console.warn('⚠️ Discord bot is not running or unreachable');
        } else if (error.code === 'ECONNABORTED') {
          console.warn('⚠️ Discord bot request timed out');
        } else {
          console.error('❌ Discord member check error:', error.response?.data || error.message);
        }
      } else {
        console.error('❌ Unexpected error during Discord member check:', error);
      }
      return false; // Assume not in server if we can't check
    }
  }
}

// Export a singleton instance
export default new DiscordRoleService();