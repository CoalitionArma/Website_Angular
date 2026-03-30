import { Component } from '@angular/core';
import { NgFor } from '@angular/common';

interface Mod {
  name: string;
  guid: string;
  image: string;
}

interface ModCategory {
  name: string;
  mods: Mod[];
}

@Component({
  selector: 'app-mods',
  standalone: true,
  imports: [NgFor],
  templateUrl: './mods.component.html',
  styleUrl: './mods.component.scss'
})
export class ModsComponent {
  readonly workshopBaseUrl = 'https://reforger.armaplatform.com/workshop/';

  workshopUrl(guid: string): string {
    return this.workshopBaseUrl + guid;
  }

  categories: ModCategory[] = [
    {
      name: 'Terrains',
      mods: [
        { name: 'Al Hadra', guid: '68957914EA45BA6C', image: 'https://ar-gcp-cdn.bistudio.com/image/4c59/49da050602c770d24ccc3c2f31b34b0683e76d139acc73b8e4ca965ebd1e/139667.jpg' },
        { name: 'Chernarus Minus', guid: '665D1AA55B5D8076', image: 'https://ar-gcp-cdn.bistudio.com/image/c12f/f22fbc354a5f07a7da5e6a135cd067b730882ae0f4a61a7453b19ad150c2/88262.jpg' },
        { name: 'FallujahV2', guid: '6895026E1FEAD75D', image: 'https://ar-gcp-cdn.bistudio.com/image/6e76/3f7239310cc277dc8746cd2fb0597e5f5c7168ccfad17cbc605b6fbd8a9d/121181.jpg' },
        { name: 'Mussalo', guid: '59CF333B3A309D6E', image: 'https://ar-gcp-cdn.bistudio.com/image/92ee/a49ccf7d447af4178667d18561cb0ffdefbb5293bdb8296ef2a28506e8fe/97037.jpg' },
        { name: 'The Golden Gate', guid: '6734F85352EF7A79', image: 'https://ar-gcp-cdn.bistudio.com/image/7ca0/b7b3a21ac2a3ab054b04174f23df78d947abc4ccff925842841a490ae26c/80169.jpg' },
        { name: 'Zarichne', guid: '61732D4F7D980E9A', image: 'https://ar-gcp-cdn.bistudio.com/image/0766/e4ad7b00157292762d923145ee792850b868a95651121c5f2066c03f36da/84029.jpg' },
      ]
    },
    {
      name: 'ACE Dev',
      mods: [
        { name: 'ACE Captives Dev', guid: '65AD7C249E4ECDFB', image: 'https://ar-gcp-cdn.bistudio.com/image/45b3/075b134b23fab04f2a06a0efaa8352a0b3c76e176a2ae9176b071d2910f5/6814.jpg' },
        { name: 'ACE Carrying Dev', guid: '65AD7C379CBD394D', image: 'https://ar-gcp-cdn.bistudio.com/image/45b3/075b134b23fab04f2a06a0efaa8352a0b3c76e176a2ae9176b071d2910f5/6814.jpg' },
        { name: 'ACE Chopping Dev', guid: '65AD7BCC9F6B3B4E', image: 'https://ar-gcp-cdn.bistudio.com/image/45b3/075b134b23fab04f2a06a0efaa8352a0b3c76e176a2ae9176b071d2910f5/6814.jpg' },
        { name: 'ACE Cook-Off Dev', guid: '664AFDC993C9CE1A', image: 'https://ar-gcp-cdn.bistudio.com/image/45b3/075b134b23fab04f2a06a0efaa8352a0b3c76e176a2ae9176b071d2910f5/6814.jpg' },
        { name: 'ACE Explosives Dev', guid: '65AD7D1E9EEAFA53', image: 'https://ar-gcp-cdn.bistudio.com/image/45b3/075b134b23fab04f2a06a0efaa8352a0b3c76e176a2ae9176b071d2910f5/6814.jpg' },
        { name: 'ACE Facepaint Dev', guid: '68EAA4B96976D557', image: 'https://ar-gcp-cdn.bistudio.com/image/45b3/075b134b23fab04f2a06a0efaa8352a0b3c76e176a2ae9176b071d2910f5/6814.jpg' },
        { name: 'ACE Finger Dev', guid: '65AD7D2E9866FA6E', image: 'https://ar-gcp-cdn.bistudio.com/image/45b3/075b134b23fab04f2a06a0efaa8352a0b3c76e176a2ae9176b071d2910f5/6814.jpg' },
        { name: 'ACE Magazine Repack Dev', guid: '65AD7D4099944EBD', image: 'https://ar-gcp-cdn.bistudio.com/image/45b3/075b134b23fab04f2a06a0efaa8352a0b3c76e176a2ae9176b071d2910f5/6814.jpg' },
        { name: 'ACE Medical Circulation Dev', guid: '65AD7D4F994EA327', image: 'https://ar-gcp-cdn.bistudio.com/image/45b3/075b134b23fab04f2a06a0efaa8352a0b3c76e176a2ae9176b071d2910f5/6814.jpg' },
        { name: 'ACE Medical Core Dev', guid: '6586079789278413', image: 'https://ar-gcp-cdn.bistudio.com/image/45b3/075b134b23fab04f2a06a0efaa8352a0b3c76e176a2ae9176b071d2910f5/6814.jpg' },
        { name: 'ACE Medical Hitzones Dev', guid: '65B343F799FB521B', image: 'https://ar-gcp-cdn.bistudio.com/image/45b3/075b134b23fab04f2a06a0efaa8352a0b3c76e176a2ae9176b071d2910f5/6814.jpg' },
        { name: 'ACE Tactical Ladder Dev', guid: '65AD7CB89F219E38', image: 'https://ar-gcp-cdn.bistudio.com/image/45b3/075b134b23fab04f2a06a0efaa8352a0b3c76e176a2ae9176b071d2910f5/6814.jpg' },
        { name: 'ACE Trenches Dev', guid: '65AD7CE59E8DB349', image: 'https://ar-gcp-cdn.bistudio.com/image/45b3/075b134b23fab04f2a06a0efaa8352a0b3c76e176a2ae9176b071d2910f5/6814.jpg' },
        { name: 'ACE Weather Dev', guid: '667B230F9505C8BA', image: 'https://ar-gcp-cdn.bistudio.com/image/45b3/075b134b23fab04f2a06a0efaa8352a0b3c76e176a2ae9176b071d2910f5/6814.jpg' },
      ]
    },
    {
      name: 'WCS Weapons Suite',
      mods: [
        { name: 'WCS_Weapons', guid: '65CF7AE8574E06D2', image: 'https://ar-gcp-cdn.bistudio.com/image/636f/53ae65c1ad1e8b05d7dab72955a1ede89ce54ee3ff8e17ffc7bccb789892/28565.jpg' },
        { name: 'WCS_Sounds', guid: '631C3C1AEE9C90BC', image: 'https://ar-gcp-cdn.bistudio.com/image/2810/174284958575cb29e334b072a7efd79e4c5b8cff8b0b3bc9b57ca947728d/27725.jpg' },
        { name: 'WCS_Scopes', guid: '62A668F513428630', image: 'https://ar-gcp-cdn.bistudio.com/image/8952/3f25976e4002b09efee0ae739fdbf58a8de5ab42ea585bdf80cf7b7e701d/27725.jpg' },
        { name: 'WCS_FlipPush', guid: '612851D73DF01668', image: 'https://ar-gcp-cdn.bistudio.com/image/7xIA/5tV82fY5qc3X1HVa3wplMScMT2iWiN66gE2XeVs/91615.jpg' },
        { name: 'WCS_NATO', guid: '615806DC6C57AF02', image: 'https://ar-gcp-cdn.bistudio.com/image/f2f4/e149a33dd89c7959b4392fc032e4fee1e81f211fead280a7d8787730e965/25711.jpg' },
        { name: 'WCS_RU', guid: '615818DA7C0343FD', image: 'https://ar-gcp-cdn.bistudio.com/image/d670/09ea5b6b9ad8a2dddf00f1d04ae22c99987a6737ba11220760403745ea03/27231.jpg' },
        { name: 'WCS_Attachments', guid: '61C74A8B647617DA', image: 'https://ar-gcp-cdn.bistudio.com/image/bba5/99e9b1990185fd4c8610f806d86604367d4b05294325c7e3b10d17a54d2c/28832.jpg' },
        { name: 'WCS_Armbands', guid: '61E42AE6714A3CC2', image: 'https://ar-gcp-cdn.bistudio.com/image/88b0/bab6c7f9654f75a0d6b59d8b30f5827e813cf314c296a93d2fd10031ffe2/29028.jpg' },
        { name: 'WCS_Earplugs', guid: '612F512CD4CB21D5', image: 'https://ar-gcp-cdn.bistudio.com/image/2075/22156b437b0a8ec58adca2aae8750583af055aa1eaa6be88af2ec5168a17/28470.jpg' },
      ]
    },
    {
      name: 'ARMA-RY Weapons',
      mods: [
        { name: 'ARMA-RY Claw Mount', guid: '6614BC5EC4E1675B', image: 'https://ar-gcp-cdn.bistudio.com/image/4e47/fb3e9b36203b3a1c7707e127cee092f115f0a9a628924c08a8e056a85d3d/58688.jpg' },
        { name: 'ARMA-RY G3 Modernised', guid: '6614BD8AC622B696', image: 'https://ar-gcp-cdn.bistudio.com/image/bfa7/3603ff291bcc971540e8b766687717adcb6a6176ea53693ba5bd4525ad7b/97153.jpg' },
        { name: 'ARMA-RY G3 Special Rifles', guid: '6614BD0AC038E724', image: 'https://ar-gcp-cdn.bistudio.com/image/2fef/55ff5e493c848f35652d4805949363336ee1a4d85e14d8176814ed755cb4/32941.jpg' },
        { name: 'ARMA-RY M1911A1 Pistol', guid: '665B1AF5996EB7AA', image: 'https://ar-gcp-cdn.bistudio.com/image/986c/61b8fa6f9aeb3ba7f6f7ad5074bd9eba1959c7e1aaac7171f2defc61e114/77014.jpg' },
        { name: 'ARMA-RY M79 Grenade Launcher', guid: '66731579C7075EB3', image: 'https://ar-gcp-cdn.bistudio.com/image/0952/f71be737f2ec39a00778a34a04af3d427a83ed0e5d07219e5d12cc8c0fea/88054.jpg' },
        { name: 'ARMA-RY Retro Optics', guid: '66C4D6C8EA530745', image: 'https://ar-gcp-cdn.bistudio.com/image/24bf/d2c00fe2ec7a38d3153db1e350107ea73a484fe882966a951d2c6701c29c/59150.jpg' },
        { name: 'ARMA-RY Soviet Equipment', guid: '671F3CDAC20CDDC1', image: 'https://ar-gcp-cdn.bistudio.com/image/a2bb/1e696392af9369ea30f110329de61b12cc78db0ed004fc65ce9966cea22d/115231.jpg' },
        { name: 'ARMA-RY Soviet Optics', guid: '67153CD5DC771D42', image: 'https://ar-gcp-cdn.bistudio.com/image/5aa2/fe59651457129b6ebe13f9083e097c437d94c8732cefe98bf66eedc232e8/131121.jpg' },
      ]
    },
    {
      name: 'Big Chungus Weapons Pack',
      mods: [
        { name: 'Big Chungus Bolt Guns', guid: '61BD6595183FCEBD', image: 'https://ar-gcp-cdn.bistudio.com/image/ad85/e1116e333df41919e42bb90bd580c40d9edd84c26f1af2a4df09e9513378/60927.jpg' },
        { name: 'Big Chungus Launchers', guid: '6190F1B505C08562', image: 'https://ar-gcp-cdn.bistudio.com/image/1641/13ed588bfe81a004b1c29bb519f29a154634f7d16f1aa8c6044f6c9dc40b/87447.jpg' },
        { name: 'Big Chungus LMGs', guid: '61344BDC155A5A28', image: 'https://ar-gcp-cdn.bistudio.com/image/5f8f/7e5b1a71f32878dff09824890971ab1c3837d07f97ca99dca4a3c3a10cb9/140959.jpg' },
        { name: 'Big Chungus Rifles', guid: '62A711001B8FDEEA', image: 'https://ar-gcp-cdn.bistudio.com/image/d87d/a626240f93d9daf7716ae328fd4d120e2b1cfec3b87ef441e09cd057fd72/111635.jpg' },
        { name: 'Big Chungus Shotguns', guid: '620E584B1D2C96A4', image: 'https://ar-gcp-cdn.bistudio.com/image/a975/b2e4ddebd56a08a0f92b2d1bf2c459eb06fdd188325c4771be6291f444b5/81333.jpg' },
        { name: 'Big Chungus SMGs', guid: '60E6F54E174C53C5', image: 'https://ar-gcp-cdn.bistudio.com/image/5568/1b0b26d0abf8e971a5e83f887820417718105fd59fc84c11def33f8c405a/147105.jpg' },
      ]
    },
    {
      name: 'Vehicles & Aircraft',
      mods: [
        { name: 'C-130 Hercules', guid: '62A302A23B480373', image: 'https://ar-gcp-cdn.bistudio.com/image/b201/f9eff703c0c0f7f7366d1c4904e4f43a5a538033aa0d77d9d2291d6bdf6b/78506.jpg' },
        { name: 'Gs Flight Model Pack', guid: '68846A953735DF39', image: 'https://ar-gcp-cdn.bistudio.com/image/701a/fe102300778b5146243baeb4fd996887796b3246d07d0df1e6e9ec2afcfc/90415.jpg' },
        { name: 'Gs Mountable BTR-70', guid: '617A2E90EA218AC4', image: 'https://ar-gcp-cdn.bistudio.com/image/a023/4b28aeac715c245a829956c05468edb1e8b9404d68b8d2857f29d524f648/123317.jpg' },
        { name: 'Integrity - Coyota Offroad', guid: '68F0286BB2B783E4', image: 'https://ar-gcp-cdn.bistudio.com/image/b5c9/82156b0d7d4e85dcd47bd4895610157d90ff5502bfac4fb1972eccb9e4ca/203232.jpg' },
        { name: 'Parachute Framework', guid: '65930CB4CD0237B2', image: 'https://ar-gcp-cdn.bistudio.com/image/fd7f/9e236504792d285dfd1e6f268f16e77e8c57b05d19b693e8b164d7af8b68/81534.jpg' },
      ]
    },
    {
      name: 'Characters & Factions',
      mods: [
        { name: 'ARMA2 Skins Port', guid: '686D4A0760BC7F87', image: 'https://ar-gcp-cdn.bistudio.com/image/ad42/5a0f406cea4032df0b000673ba8a8db2b3f45c97f7c60b770d9b4676100e/137109.jpg' },
        { name: 'British Forces', guid: '5AE50EC5B8D6F4AE', image: 'https://ar-gcp-cdn.bistudio.com/image/a8d4/5f3f91a3a2e72263892230a3049f119b57b03ec953bff12fa2d2013ea4c1/59285.jpg' },
        { name: 'Early 2000s US Military', guid: '60B134EF0216CF4D', image: 'https://ar-gcp-cdn.bistudio.com/image/705f/a3fe0a4d33263d9a62b062ecec4bb6956dfb55f8b44b39f50c54afd75d97/116300.jpg' },
        { name: 'Middle East Insurgents', guid: '64CEC8E005828E5D', image: 'https://ar-gcp-cdn.bistudio.com/image/8c10/d9c928cdbac388fab32b6f62d8f56628b8af40913359abfb604a9c7c30ae/20985.jpg' },
        { name: 'RHS - Status Quo', guid: '595F2BF2F44836FB', image: 'https://ar-gcp-cdn.bistudio.com/image/619c/8e2af38c478b8b8d78307e337d02f452c46b4c1a5e41608af8089e4c5351/13141.jpg' },
        { name: 'ToH ReCharacters Man', guid: '596330D9AF34AF38', image: 'https://ar-gcp-cdn.bistudio.com/image/9ec4/771e2444824d2fcd04d4d38e1650996cf0e8eac396a9e9d19b0f7159c71f/86380.jpg' },
        { name: 'TROOPFIT ARSENAL', guid: '686146A940C9D3EA', image: 'https://ar-gcp-cdn.bistudio.com/image/8e88/7d576143dae38d56668085f59992c631b9b77d61bd6bd6fb97937eff6e62/137723.jpg' },
        { name: 'TTsKO Plus', guid: '6676B89E6B8E35B3', image: 'https://ar-gcp-cdn.bistudio.com/image/cdb3/747a1e51e7b2b3108e688a848068cd0d09df4d1982ea94bdfb7f794e24a7/183404.jpg' },
      ]
    },
    {
      name: 'Coalition Custom',
      mods: [
        { name: 'Coalition Squad Interface', guid: '5B0D1E4380971EBD', image: 'https://ar-gcp-cdn.bistudio.com/image/ac92/3cea4c251efa09a3698c10a978ff3de88b9c3c4f95bf04ba7fd9c63066ec/15082.jpg' },
        { name: 'COALITION Radios', guid: '61E34313E144DDA8', image: 'https://ar-gcp-cdn.bistudio.com/image/011e/f4bacee1a0e12df9e8e97df466457ee350baad4f835dfda62aca8a22fc35/47745.jpg' },
        { name: 'Coalition VON', guid: '6624E618B9058265', image: 'https://ar-gcp-cdn.bistudio.com/image/af53/d84ca2bf6492f1a54a08d298e39549454da868747db80e70bba69d5a95d4/34373.jpg' },
        { name: 'Coalition Battle Royal Addon', guid: '686F41B5C4D229A4', image: 'https://ar-gcp-cdn.bistudio.com/image/6156/897f4e13555cdf7796d6a46de49584677256c20c65ed8b432ccf70a427d4/16032.jpg' },
        { name: 'fluffs Coalition Gear', guid: '672C4CF30574F4E0', image: 'https://ar-gcp-cdn.bistudio.com/image/ee46/5496c23d141be3d63d0278f912427d6b8b5369c863212310288e6d352401/63462.jpg' },
      ]
    },
    {
      name: 'Gameplay & Mechanics',
      mods: [
        { name: 'Accurate Map Markers', guid: '670C26EAB7B57C77', image: 'https://ar-gcp-cdn.bistudio.com/image/192d/7b4472d90fe02f74546b4acbd665fdd126d5d58644a93260bcd18212fd62/5507.jpg' },
        { name: 'Adult Mortars', guid: '6318DCB19B389CC8', image: 'https://ar-gcp-cdn.bistudio.com/image/afba/2c5f0a45926efed7e130e4cfcfdcf2155b7f9b72c7f3e44b67919f4dd50f/8706.jpg' },
        { name: 'AT-4', guid: '64E37695015F8AFA', image: 'https://ar-gcp-cdn.bistudio.com/image/fc52/f19a360d01e0eea88e4ead801ac3e849d06f7d386d0cc5173cd6f849c6a8/112728.jpg' },
        { name: 'Atmospheric Weather Mod', guid: '64ED6553B8AF6B62', image: 'https://ar-gcp-cdn.bistudio.com/image/8b13/6ef5b085699571d670ed7889ae480b017b3e0ec1c60917d9f13617446316/83735.jpg' },
        { name: 'Bon Action Animations', guid: '5C9758250C8C56F1', image: 'https://ar-gcp-cdn.bistudio.com/image/fab8/0756858994faee001f3397f8387f533f3066db14c9971496196cbfb3ad99/105231.jpg' },
        { name: 'Disable Game Master Budgets', guid: '5F2944B7474F043F', image: 'https://ar-gcp-cdn.bistudio.com/image/78a4/e6cb51ec20a897d0db87310c1446ca9951da43a081b1edb755df995c3f76/186192.jpg' },
        { name: 'Enhanced Maps', guid: '644B042109700804', image: 'https://ar-gcp-cdn.bistudio.com/image/7306/72dfe39cd9b5d7d43e13a8a06f71b167144fec1d994134ac4ce2a7a9d66f/236299.jpg' },
        { name: 'Flashlight Stays On When Dropped', guid: '64CD29251DC39859', image: 'https://ar-gcp-cdn.bistudio.com/image/96e0/45abd19c3e52ac1e97e13e9b6997f89bbe8f192ae34331bed0e9fdcd2a54/12128.jpg' },
        { name: 'Game Master Enhanced', guid: '5964E0B3BB7410CE', image: 'https://ar-gcp-cdn.bistudio.com/image/7fe8/3fe294f58bddaaf552c945b6c1d7667ec921e2c05c4c6f4070cc18a9ab5e/12063.jpg' },
        { name: 'Game Master FX', guid: '5994AD5A9F33BE57', image: 'https://ar-gcp-cdn.bistudio.com/image/a646/c24f29d0f38d0a211790160612e5605fbbc46147914d871e460259f27baf/6383.jpg' },
        { name: 'GC Suppression', guid: '684CE8AA3B1D6573', image: 'https://ar-gcp-cdn.bistudio.com/image/2554/72fd11925bc675832056dc32132de730dc56091b7a725524db59806b713d/25033.jpg' },
        { name: 'Improved Blood Effect', guid: '62FCEB51DF8527B6', image: 'https://ar-gcp-cdn.bistudio.com/image/2ce1/9c6f718a74413df7f374a1dde990c6c4ee210ad8a7f4fea2277aeee73056/133144.jpg' },
        { name: 'M249 Scope Rails', guid: '5AF6E0F075D79473', image: 'https://ar-gcp-cdn.bistudio.com/image/0a50/98676131e116ad46f7f502a226a95c44f62977cb07bd57e2a4b5bd2209c6/124160.jpg' },
        { name: 'Map Drawing', guid: '656AC01634459D8D', image: 'https://ar-gcp-cdn.bistudio.com/image/a9c7/211ccd97fd0ce9588a01a9d41f23c5ced345e9019baf30699c2c69b79409/156306.jpg' },
        { name: 'Map Exporter with TIL Drawings', guid: '66212054B3A0EDC6', image: 'https://ar-gcp-cdn.bistudio.com/image/6156/897f4e13555cdf7796d6a46de49584677256c20c65ed8b432ccf70a427d4/16032.jpg' },
        { name: 'Melee Combat Extended', guid: '6595113A3678CF5D', image: 'https://ar-gcp-cdn.bistudio.com/image/548b/b7e8fa91fe16ed6ddc33aa91b66432986d52e996c028d949c8cae57db974/110020.jpg' },
        { name: 'MG3 with RIS Rail', guid: '6497438B19727E0D', image: 'https://ar-gcp-cdn.bistudio.com/image/8984/ac229a0149089e6d5461d6a8eeeddf5a059a151250d4f4b837d9394245a5/105433.jpg' },
        { name: 'Nasty Explosives', guid: '65CB34AF1C70AEC6', image: 'https://ar-gcp-cdn.bistudio.com/image/9913/e6c508d4ddd2ff227713adfc59986e0ff47eaf3e13256dbd28df2cb1093b/141042.jpg' },
        { name: 'No Weapon Drop Unconscious', guid: '60612C225328522E', image: 'https://ar-gcp-cdn.bistudio.com/image/3074/9d02f752cb1ad6a1d1ac4578dab7ef55f97b4dcb68e6675e017f41b21e37/52716.jpg' },
        { name: 'Realistic Combat Drones', guid: '65AD60E204191D37', image: 'https://ar-gcp-cdn.bistudio.com/image/28a7/6718a87e34450dedb2951399116f3a8223994fa1979b131a8ed2b01436d3/39722.jpg' },
        { name: 'ReFX - Effects Enhancement', guid: '6172FBB03A3D6C10', image: 'https://ar-gcp-cdn.bistudio.com/image/d6c8/84afa5cfb9a85cd76c640359bd86ee472d84f82652e8666261c657f60191/32960.jpg' },
        { name: 'Server Admin Tools', guid: '5AAAC70D754245DD', image: 'https://ar-gcp-cdn.bistudio.com/image/02eb/fa431cc7ab3082e45226831f29adea91f01997e2cc65d5e2119de136fe23/17318.jpg' },
        { name: 'Slower Strafe', guid: '60557550B10EB832', image: 'https://ar-gcp-cdn.bistudio.com/image/c7e9/f61699599a67d00eabece0b46eb3ae639ce510ec628ab9d5e2a30e3dfec3/6209.jpg' },
        { name: 'Spectral Tracers - Unified', guid: '66EE300214703AC9', image: 'https://ar-gcp-cdn.bistudio.com/image/4d7a/d1c0be732df649db627e350693df7478f0c3fec6a763b2049f9a146d09ab/25560.jpg' },
        { name: 'Stun Grenade', guid: '59EAA899751805DF', image: 'https://ar-gcp-cdn.bistudio.com/image/4e61/4d2fdf1bdb0fde79c7f7d03652bd155406501cfc4f3b952794834e56fdcf/6357.jpg' },
        { name: 'Tactical Flava', guid: '5D550926D43F1409', image: 'https://ar-gcp-cdn.bistudio.com/image/a721/24c1e41bc15ba4e11ad83e07185dc98f00f593b93a04b25afd314670b9cb/19418.jpg' },
        { name: 'Thermal PostProcess', guid: '661B5884EF0760FE', image: 'https://ar-gcp-cdn.bistudio.com/image/c6ae/29aa4b5bf40ac75e14615f18c206aa2855d23b8af9b8b5b59c504a758fba/100739.jpg' },
        { name: 'Vanilla IEDs', guid: '68B6525C55B7F276', image: 'https://ar-gcp-cdn.bistudio.com/image/84b8/72b30e8c8d4a1da7864f432ffa3c0b8fa12d4bdb69a40d30ee3cef70f4ac/46016.jpg' },
        { name: 'VTF Rally Championship', guid: '60F697135C1AF8E9', image: 'https://ar-gcp-cdn.bistudio.com/image/5311/e7eceac2d658cf057ddf468ea38c33ecc36e9eabb25b388d60a5bb113282/103474.jpg' },
        { name: 'WeakerWalls', guid: '620A15433CA8D688', image: 'https://ar-gcp-cdn.bistudio.com/image/4a2d/e4525db0a8c6caed7c0978fac849b9e2f611d123a52c633253a106027f2c/72185.jpg' },
        { name: 'Wirecutters 2', guid: '62F364B35E9B51B0', image: 'https://ar-gcp-cdn.bistudio.com/image/7012/559c5f9bc6b5f466500d14c0d0d9e447f5043fe55b0adf047dd38e1edefc/60734.jpg' },
        { name: 'Zimnitrita', guid: '597697D81A1EA202', image: 'https://ar-gcp-cdn.bistudio.com/image/7602/630f890fefb01e9b55a046fee4928cf5126929d458d6c571d3cbbb9bda0e/158828.jpg' },
      ]
    },
  ];

  get totalMods(): number {
    return this.categories.reduce((sum, cat) => sum + cat.mods.length, 0);
  }
}
