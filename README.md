# EasyFiles

A web-based application for uploading, downloading, previewing, and managing PDF and DOCX files. Built to provide secure, scalable, and efficient file management. 

## Features

- **File Upload & Download:** Upload PDF/DOCX files to the server and download them as needed.
- **File Preview:** Preview files before downloading to review their contents.
- **File Management:** Delete files from the server and save downloaded files to your device.
- **Responsive UI:** Mobile-friendly and accessible on various devices.
- **Secure Storage:** Leverages AWS S3 for secure, reliable, and scalable file storage as files grow.
- **Automated Server Management:** Configured Systemd on Linux to run the application server as a background service for automatic startup and reliable request handling.
- **Optimized Deployment:** Deployed on AWS EC2 (t2.micro) with Nginx as a reverse proxy and static file server for optimized performance and security.
- **Reduced Latency:** Integrated AWS Cloudfront CDN for caching files, enabling faster delivery and reduced latency.

## AWS Integrations

- **AWS S3:** Used for secure, scalable file storage.
- **AWS EC2:** Hosts the application server.
- **AWS Cloudfront:** Integrated Cloudfront CDN for caching files.
- **AWS Lambda:** Integrated AWS Lambda for deleting files in the background asychronously.
- **AWS SQS:** Integrated AWS SQS to capture failed delete operations for processing later.
- **AWS IAM:** Assigned IAM roles to different services like Lambda, EC2, SQS to interact with each other.
- **Nginx:** Acting as a reverse proxy and static file server for React build files.

## Currently Working

- **Multipart Uploads:** Integrating S3 multipart file uploads enabling to upload large files conveniently and at a faster rate
- **Load Testing:** Integrating load testing for APIs to understand bottlenecks and latency

## Upcoming Optimizations

- **Pagination:** Implement for listing publicly available files, reducing bandwidth and resource overload.
- **AWS OpenSearch:** Integrate for faster document search functionality.

## Environment Variables

Below are the environment variables required for the application:

NODE_ENV = production / development <br>
PORT = your desired port number <br>
DEV_DATABASE = your development database URL <br>
PROD_DATABASE = your production database URL <br> 
JWT_SECRET = paste your own JWT secret <br>
DEFAULT = default url for profile picture <br>
AWS_REGION = hosted region for AWS S3 Bucket <br>
AWS_S3_BUCKET_NAME = hosted S3 bucket name <br>

## Technologies Used

- **Frontend:** React.js (for responsive UI, file previews, component optimization)
- **Backend:** Node.js (for RESTful APIs, file management, and AWS S3 integration)
- **Database:** MongoDB (for metadata and user data)
- **File Storage:** AWS S3 (for scalable file storage)
- **Deployment:** AWS EC2, Nginx, Systemd (for reliable app hosting and management) (Assigned IAM Role to EC2 instance for interacting with S3 Bucket), AWS Lambda, AWS SQS
- **Load Testing** Artillery

<h3 align="center"><b>Developed with :heart: by <a href="https://github.com/DEV270201">Devansh Shah</a></b></h3>
