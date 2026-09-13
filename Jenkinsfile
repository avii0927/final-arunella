pipeline { 
    agent any 
    tools { 
        maven 'maven3' 
        jdk 'jdk21' 
    } 
    environment { 
        IMAGE_NAME = "avii9922/arunella" //change
        CONTAINER_NAME = "arunella" //change
        DOCKERHUB_CREDS = 'dockerHub'
        SONARQUBE_SERVER = 'Git-SonarQube-Docker-Pipeline'
    } 
    stages { 
        stage('Checkout') { 
            steps { 
                // 1. ⚠️ CHANGE THIS to your actual repository URL 
                checkout scmGit(branches: [[name: '*/main']], extensions: [], userRemoteConfigs: [[url: 'https://github.com/avii0927/final-arunella.git']])
            } 
        } 
        stage('Build with Maven') { 
            steps { 
                // Compile and package the Spring Boot app 
                bat 'mvn clean package -DskipTests -f microservices/buyer-service/pom.xml'
                bat 'mvn clean package -DskipTests -f microservices/farmer-service/pom.xml'
                bat 'mvn clean package -DskipTests -f microservices/transporter-service/pom.xml'
            } 
        }
        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv("${env.SONARQUBE_SERVER}") {
                    // This command pushes the code analysis to your SonarQube server
                    bat 'mvn sonar:sonar -f microservices/buyer-service/pom.xml'
                    bat 'mvn sonar:sonar -f microservices/farmer-service/pom.xml'
                    bat 'mvn sonar:sonar -f microservices/transporter-service/pom.xml'
                }
            }
        }
        stage('Build Docker Image') { 
            steps { 
                // Build the image from the Dockerfile 
                bat 'docker build -t %IMAGE_NAME% .' 
            } 
        }
        stage('Push to docker Hub') { 
            steps { 
                script{
                    docker.withRegistry('', env.DOCKERHUB_CREDS){
                        bat 'docker push  %IMAGE_NAME%' 
                    }
                }
            } 
        } 
        stage('Stop Old Container') { 
            steps { 
                // Ignore failure if no container is currently running 
                bat 'docker stop %CONTAINER_NAME% || exit 0' 
            } 
        } 
        stage('Remove Old Container') { 
            steps { 
                bat 'docker rm %CONTAINER_NAME% || exit 0' 
            } 
        } 
        stage('Run New Container') { 
            steps { 
                // 2. ⚡ Changed port from 8080:8080 to 8500:8500 to match your app 
                bat 'docker run -d -p 8500:8500 --name %CONTAINER_NAME% %IMAGE_NAME%' 
            } 
        } 
    } 
    post { 
        success { 
            echo 'Deployment successful.' 
        } 
        failure { 
            echo 'Pipeline failed — check console output.' 
        } 
    }
}