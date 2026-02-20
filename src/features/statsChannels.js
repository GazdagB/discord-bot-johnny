import { ChannelType, PermissionFlagsBits } from 'discord.js';

const statsChannelIds = new Map();

export async function setupStatsChannels(guild) { 
// Check if we already have the category in this guild
  const existingCategory = guild.channels.cache.find(
    c => c.type === ChannelType.GuildCategory && c.name === '📊 Server Stats'
  );

  let category = existingCategory;

  if (!category) {
    category = await guild.channels.create({
      name: '📊 Server Stats',
      type: ChannelType.GuildCategory,
      position: 0,
    });
    console.log(`✅ Created "Server Stats" category in ${guild.name}`);
  }

  // Check if member count channel already exists under that category
  const existingMemberChannel = guild.channels.cache.find(
    c => c.parentId === category.id && c.type === ChannelType.GuildVoice && c.name.startsWith('👥 Members:')
  );

  let memberChannel = existingMemberChannel;

  if (!memberChannel) {
    memberChannel = await guild.channels.create({
      name: `👥 Members: ${guild.memberCount}`,
      type: ChannelType.GuildVoice,
      parent: category.id,
      permissionOverwrites: [
        {
          // Everyone can see but NOT join — read-only voice
          id: guild.roles.everyone,
          deny: [PermissionFlagsBits.Connect],
          allow: [PermissionFlagsBits.ViewChannel],
        },
      ],
    });
    console.log(`✅ Created member count channel in ${guild.name}`);
  }

  const existingInactiveMembersChannel = guild.channels.cache.find(
    c => c.parentId === category.id && c.type === ChannelType.GuildVoice && c.name.startsWith('💤 Inactive:')
  )

  let inactiveChannel = existingInactiveMembersChannel

  if(!inactiveChannel){
    inactiveChannel = await guild.channels.create(
      {
        name: '💤 Inactive:',
        type: ChannelType.GuildVoice,
        parent: category.id,
        permissionOverwrites: [                                                                                                             
    {
      id: guild.roles.everyone,
      deny: [PermissionFlagsBits.Connect],
      allow: [PermissionFlagsBits.ViewChannel],
    },
    {
      id: guild.members.me.id,
      allow: [PermissionFlagsBits.ManageChannels, PermissionFlagsBits.ViewChannel],
    },
  ]
      }
    )
    console.log(`✅ Created inactive count channel in ${guild.name}`);
  }


  const existingActiveMembersChannel = guild.channels.cache.find(
    c => c.parentId === category.id && c.type === ChannelType.GuildVoice && c.name.startsWith('✅ Active')
  )

  let activeMembersChannel = existingActiveMembersChannel;

  if(!activeMembersChannel){
    activeMembersChannel = await guild.channels.create({
      name: '✅ Active:',
      type: ChannelType.GuildVoice,
      parent: category.id,
      permissionOverwrites: [
        {
          id: guild.roles.everyone,
          deny: [PermissionFlagsBits.Connect],
          allow: [PermissionFlagsBits.ViewChannel],
        },
        {
      id: guild.members.me.id,
      allow: [PermissionFlagsBits.ManageChannels, PermissionFlagsBits.ViewChannel],
    },
      ]
    })
    console.log(`✅ Created active count channel in ${guild.name}`);
  }

    statsChannelIds.set(guild.id, {
    categoryId: category.id,
    memberChannelId: memberChannel.id,
    inactiveChannelId: inactiveChannel.id,
    activeChannelId: activeMembersChannel.id
  });

  // Sync the count right away in case it's stale
  await updateMemberCount(guild);
}

export async function updateMemberCount(guild) {
  const ids = statsChannelIds.get(guild.id);
  if (!ids) return;

  const inactiveRole = guild.roles.cache.find(r => r.name === '💤 Inactive');
  const inactiveCount = inactiveRole ? inactiveRole.members.size : 0;
  const totalCount = guild.memberCount;
  const activeCount = totalCount - inactiveCount;

  const updates = [
    { id: ids.memberChannelId,   name: `👥 Members: ${totalCount}` },
    { id: ids.inactiveChannelId, name: `💤 Inactive: ${inactiveCount}`},
    {id: ids.activeChannelId, name: `✅ Active: ${activeCount}`}
  ];

  for (const { id, name } of updates) {
    const ch = guild.channels.cache.get(id);
    if (!ch || ch.name === name) continue;
    await ch.setName(name).catch(err =>
      console.error(`❌ Failed to update ${name}:`, err)
    );
  }

  console.log(`🔄 Updated stats in ${guild.name} — Total: ${totalCount}, Active: ${activeCount}, Inactive: ${inactiveCount}`);
}