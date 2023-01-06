import mongoose from 'mongoose';

process.env.NODE_ENV = 'test';

const config = {
  db: {
    test: 'mongodb://localhost/test',
  },
  connection: null,
};

export function connect() {
  return new Promise<void>((resolve, reject) => {
    if (config.connection) {
      return resolve();
    }

    const mongoUri = 'mongodb://localhost/test';

    mongoose.Promise = Promise;

    
    mongoose.connect(mongoUri);

    mongoose.connection
      .once('open', resolve)
      .on('error', (e) => {
        if (e.message.code === 'ETIMEDOUT') {
          console.log(e);

          mongoose.connect(mongoUri);
        }

        console.log(e);
        reject(e);
      });
  });
}

export async function clearDatabase() {
    for (const i in mongoose.connection.collections) {
      await mongoose.connection.collections[i].drop();
    }
}
