import { Db } from 'mongodb';

export = {
  async up(db: Db) {
    await db
      .collection('users')
      .createIndex(
        { email: 1 },
        { unique: true, name: 'users.email.unique_index' },
      );
  },

  async down(db: Db) {
    await db.collection('users').dropIndex('users.email.unique_index');
  },
};
