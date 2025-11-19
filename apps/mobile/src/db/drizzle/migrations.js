// This file is required for Expo/React Native SQLite migrations - https://orm.drizzle.team/quick-sqlite/expo

import m0000 from './0000_demonic_ultron.sql'
import journal from './meta/_journal.json' with { type: 'json' }

export default {
  journal,
  migrations: {
    m0000,
  },
}
