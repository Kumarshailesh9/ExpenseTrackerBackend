const AWS = require('aws-sdk');
require('dotenv').config();

exports.uploadToS3 =  ( data , filename ) => {
        const BUCKET_NAME = 'expensetrackerappss';
        
        const s3Bucket = new AWS.S3({
            accessKeyId: process.env.IAM_USER_KEY,
            secretAccessKey: process.env.IAM_USER_SECRET
        });

        

            return new Promise((resolve, reject) => {

                s3Bucket.createBucket(() => {
                    var params = {
                        Bucket : BUCKET_NAME,
                        Key: filename,
                        Body: data,
                        ACL: 'public-read'
                    }

                s3Bucket.upload(params , (err, s3response) => {
                    if(err){
                        console.log('something went wrong', err);
                        reject(err);
                    } else {
                        console.log('success', s3response);
                        resolve(s3response.Location);
                    }
            })
            })
                
        
        })
}
