# **BotaniPal-backend-service**

## **API Documentation:**

https://drive.google.com/file/d/1L2nb_CH2s2DgBIjgQ_LgU-ll6j0L9naw/view?usp=sharing

## **Pre-Requisite**

Node.js v20.14.0

Firebase

## **How to Prepare the Environment**

You need to prepare the environment first:

    PORT=
    JWT_SECRET=
    FIREBASE_PROJECT_ID=
    FIREBASE_PRIVATE_KEY_ID=
    FIREBASE_PRIVATE_KEY=
    FIREBASE_CLIENT_EMAIL=
    FIREBASE_CLIENT_ID=
    FIREBASE_AUTH_URI=
    FIREBASE_TOKEN_URI=
    FIREBASE_AUTH_PROVIDER_X509_CERT_URL=
    FIREBASE_CLIENT_X509_CERT_URL=
    FIREBASE_STORAGE_BUCKET=
    PLANT_MODEL_URL=
    DISEASE_MODEL_URL=
    FORECAST_MODEL_URL=
    EMAIL_USER=
    EMAIL_PASSWORD=

You can ask the repository owner for the credentials*

Now you are ready and you can run: 

    npm install && npm run start


## Deploy Cloud RUN
### 1. Clone https://github.com/BotaniPal/cc-botanipal.git
### 2. Create New Project on Google Cloud Platform (Console): https://console.cloud.google.com/welcome/new
On the project that you created, Activate `Cloud Run Admin API` and `Cloud Build API`
### 3. Install GCloud SDK on local device
after installation https://cloud.google.com/sdk/docs/install, run:
```
gcloud init
```
### 4. Set DockerFile and dockerignore
https://cloud.google.com/run/docs/quickstarts/build-and-deploy#containerizing
### 5. Cloud Run Deployment
```
gcloud builds submit --tag gcr.io/<project_name>/botanipal-frontend
```
```
gcloud run deploy --image gcr.io/<project_name>/botanipal-frontend --platform managed
```
<br/>
after deployment check it on your `Google Cloud Console > Cloud Run`
<br/><br/><br/>
