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
                catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
                    withSonarQubeEnv("${env.SONARQUBE_SERVER}") {
                        // Push code analysis to SonarQube server
                        bat 'mvn sonar:sonar -f microservices/buyer-service/pom.xml'
                        bat 'mvn sonar:sonar -f microservices/farmer-service/pom.xml'
                        bat 'mvn sonar:sonar -f microservices/transporter-service/pom.xml'
                    }
                }
            }
        }
        stage('Build Docker Images') { 
            steps { 
                echo 'Building Docker images for all microservices...'
                bat 'docker compose build'
            } 
        }
        stage('Deploy Microservices') { 
            steps { 
                echo 'Deploying containers with Docker Compose...'
                bat 'docker compose down || exit 0'
                bat 'docker compose up -d'
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