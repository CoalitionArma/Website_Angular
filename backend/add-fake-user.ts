import sequelize from './src/db';
import Event from './src/models/eventModel';

async function addFakeUser() {
  try {
    // Find the event
    const event = await Event.findOne({
      where: { id: '325af5a1-a05d-402d-b481-958c6bac425e' }
    });

    if (!event) {
      console.log('Event not found');
      return;
    }

    console.log('Found event:', event.title);

    // Parse the groups
    const groups = JSON.parse(event.groups as string);
    
    // Add fake user to the first role of the first group
    if (groups[0] && groups[0].roles[0]) {
      const role = groups[0].roles[0];
      role.slottedUser = 'FakeUser123';
      role.slottedUserId = 'fake_discord_id_12345';
      
      console.log('Adding fake user to role:', role.name);
      
      // Update the event
      await event.update({ groups: JSON.stringify(groups) });
      console.log('✅ Successfully added fake user to event!');
      console.log('Role now shows:', role.slottedUser);
    } else {
      console.log('No roles found in event');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
}

addFakeUser();