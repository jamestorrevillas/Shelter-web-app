const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.cancelStaleApplications = functions.pubsub.schedule('every 24 hours').onRun(async (context) => {
    const applicationsRef = admin.database().ref('applicationform');
    const now = Date.now();

    const applicationsSnapshot = await applicationsRef.once('value');
    const applications = applicationsSnapshot.val();

    for (const appId in applications) {
        const app = applications[appId];
        if (app.remarks === 'APPROVED' && app.status !== 1) {
            const approvalTime = new Date(app.approvalTime).getTime(); // adjust 'approvalTime' field as per your database
            if (now - approvalTime > 3 * 24 * 60 * 60 * 1000) { // 3 days in milliseconds
                applicationsRef.child(appId).update({ remarks: 'CANCELLED' });
            }
        }
    }
    return null;
});
