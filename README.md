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

## AWS Integrations

- **AWS S3:** Used for secure, scalable file storage.
- **AWS EC2:** Hosts the application server.
- **Nginx:** Acts as a reverse proxy and static file server for React build files.

## Upcoming Optimizations

- **AWS CloudFront:** Integrate for caching files, enabling faster delivery and reduced download times.
- **Pagination:** Implement for listing publicly available files, reducing bandwidth and resource overload.
- **AWS OpenSearch:** Integrate for faster document search functionality.

## Environment Variables

Below are the environment variables required for the application:

NODE_ENV = production / development <br>
PORT = 4000 <br>
DEV_DATABASE = your development database URL <br>
PROD_DATABASE = your production database URL <br> 
JWT_SECRET = paste your own JWT secret <br>
DEFAULT = default url for profile picture <br>
AWS_REGION = hosted region for AWS S3 Bucket <br>
AWS_S3_BUCKET_NAME = hosted S3 bucket name <br>

## Technologies Used

- **Frontend:** React (for responsive UI, file previews, component optimization)
- **Backend:** Node.js (for RESTful APIs, file management, and AWS S3 integration)
- **Database:** MongoDB (for metadata and user data)
- **File Storage:** AWS S3 (for scalable file storage)
- **Deployment:** AWS EC2, Nginx, Systemd (for reliable app hosting and management) (Assigned IAM Role to EC2 instance for interacting with S3 Bucket)

ScreenShots:

HOME:
![image](https://user-images.githubusercontent.com/56965636/205449549-5923f4c6-230e-45fc-b7ba-d67d173427d0.png)

REGISTER:
![image](https://user-images.githubusercontent.com/56965636/205449593-4d89f118-34b3-47c2-8320-6b97be84be16.png)

LOGIN:
![image](https://user-images.githubusercontent.com/56965636/205450175-f899c8b0-4d08-4fde-838f-5dcf317e158b.png)

UPLOAD:
![image](https://user-images.githubusercontent.com/56965636/205449788-c400aee3-e83b-4c74-9ff1-70f47f7c9f2b.png)

FILES:
![image](https://github.com/user-attachments/assets/dde17a06-5688-4bc6-8b51-bceab1a4bb58)

![image](https://github.com/user-attachments/assets/6920d61c-9578-4c12-b416-7ac50a0eb5fa)

PROFILE:
![image](https://github.com/user-attachments/assets/ca75932b-77ab-49be-ad81-18fc680df5dd)

STATUS CHANGING OF FILE:
![image](https://user-images.githubusercontent.com/56965636/205450112-d99d894b-4b45-4255-aaac-ae8d25433dd5.png)


<h3 align="center"><b>Developed with :heart: by <a href="https://github.com/DEV270201">Devansh Shah</a></b></h3>
