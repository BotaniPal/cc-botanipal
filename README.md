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

## Run Locally
### 1. Install Needed Tools and Dependencies
```
npm install --save-dev typescript @types/react @types/node
npx tsc --init
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install aos
npm i --save-dev @types/aos
npm install react-icons
yarn add react-icons
npm install @tailwindcss/forms
yarn add @tailwindcss/forms
```
### 2. Start your Website with the commands below
```
npm run dev
```

