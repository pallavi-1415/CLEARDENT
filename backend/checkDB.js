const mongoose = require('mongoose');

const uri = 'mongodb+srv://pallaviramoliya1415_db_user:Y8kAyreqAIs8DywH@dental.bqtt4wm.mongodb.net/?appName=dental';

async function run() {
  try {
    await mongoose.connect(uri);
    const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
    const users = await User.find({});
    
    const doctors = await User.find({ role: 'doctor' });
    console.log(`\nDoctors count: ${doctors.length}`);
    doctors.forEach(d => console.log(`- ${d.name} (Approved: ${d.isApproved})`));

    const approvedDoctors = await User.find({ role: 'doctor', isApproved: true });
    console.log(`\nApproved Doctors count: ${approvedDoctors.length}`);
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.disconnect();
  }
}

run();
