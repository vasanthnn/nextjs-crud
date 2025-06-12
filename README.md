# 📝 Next.js CRUD App with AWS S3 Image Upload & EC2 Deployment

This is a full-stack CRUD application built using **Next.js**, **MongoDB**, and **AWS S3** for secure image uploads. The app is deployed on an **Amazon EC2** instance with IAM-based access and automated CI/CD via **GitHub Actions**.

---

## 🚀 Features

- ✍️ Add, view, update, and delete tasks
- 🖼️ Upload images to AWS S3 securely
- 🔒 No AWS credentials exposed (IAM Role attached to EC2)
- ⚙️ GitHub Actions CI/CD pipeline for production deployment
- 🧠 Built with clean architecture and production best practices

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15
- **Styling**: Tailwind CSS
- **Database**: MongoDB with Mongoose
- **Cloud**: AWS S3 (file storage), EC2 (hosting), IAM Role (secure access)
- **Process Manager**: PM2
- **CI/CD**: GitHub Actions

---

## 📦 Local Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/nextjs-crud-app.git
   cd nextjs-crud-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure local environment**
   Create a `.env.local` file:
   ```env
   MONGODB_URI=your_mongodb_uri
   AWS_REGION=us-east-1
   AWS_BUCKET_NAME=your-bucket-name
   AWS_ACCESS_KEY_ID=your-access-key-id
   AWS_SECRET_ACCESS_KEY=your-secret-access-key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

---

## ☁️ EC2 Deployment Steps

1. **Attach IAM Role to EC2**
   - Go to EC2 → Actions → Security → Modify IAM Role
   - Select a role with **AmazonS3FullAccess** policy

2. **Connect to EC2 and set up environment**
   ```bash
   touch .env.production
   ```
   Add:
   ```env
   MONGODB_URI=your_mongodb_uri
   AWS_REGION=us-east-1
   AWS_BUCKET_NAME=your-bucket-name
   ```

3. **Deploy Script**
   Create a `deploy.sh` in EC2:
   ```bash
   #!/bin/bash
   cd ~/nextjs-crud
   git pull origin main
   npm install
   npm run build
   pm2 restart nextjs-crud || pm2 start npm --name "nextjs-crud" -- start
   ```

4. **GitHub Actions Workflow**
   Store these secrets: `EC2_HOST`, `EC2_USERNAME`, `EC2_SSH_KEY` (base64 encoded)

   `.github/workflows/deploy.yml`:
   ```yaml
   name: Deploy to EC2

   on:
     push:
       branches:
         - main

   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - name: Checkout code
           uses: actions/checkout@v3

         - name: Decode SSH key
           run: |
             mkdir -p ~/.ssh
             echo "${{ secrets.EC2_SSH_KEY }}" | base64 -d > ~/.ssh/id_rsa
             chmod 600 ~/.ssh/id_rsa

         - name: Deploy via SSH
           run: |
             ssh -o StrictHostKeyChecking=no ${{ secrets.EC2_USERNAME }}@${{ secrets.EC2_HOST }} "bash ~/deploy.sh"
   ```

---

## 🧪 How It Works

- Uploaded images go to S3 with a `PutObjectCommand` from `@aws-sdk/client-s3`
- Images are not public; instead, a **presigned URL** is generated at request-time
- Your app on EC2 uses IAM Role to access S3 without any environment credentials

---

## 🖥️ Screenshots / Demo

will upload later.

---

## 👨‍💻 Author

Built with passion by **Vasanthan** 💻✨

---

## 📜 License

MIT © 2025
