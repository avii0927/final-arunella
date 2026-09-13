pipeline { 
    agent any 
    tools { 
        maven 'maven3' 
        jdk 'jdk21' 
    } 
    environment { 
        DOCKERHUB_CREDS = 'dockerHub'
        SONARQUBE_SERVER = 'Git-SonarQube-Docker-Pipeline'
    } 
    stages { 
        stage('Checkout') { 
            steps { 
                checkout scmGit(branches: [[name: '*/main']], extensions: [], userRemoteConfigs: [[url: 'https://github.com/avii0927/final-arunella.git']])
            } 
        } 
        stage('Build with Maven') { 
            steps { 
                bat 'mvn clean package -DskipTests -f microservices/buyer-service/pom.xml'
                bat 'mvn clean package -DskipTests -f microservices/farmer-service/pom.xml'
                bat 'mvn clean package -DskipTests -f microservices/transporter-service/pom.xml'
            } 
        }
        stage('SonarQube Analysis') {
            steps {
                catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
                    withSonarQubeEnv("${env.SONARQUBE_SERVER}") {
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
        stage('Push to Docker Hub') { 
            steps { 
                echo 'Pushing Docker images to Docker Hub...'
                script {
                    docker.withRegistry('', env.DOCKERHUB_CREDS) {
                        bat 'docker compose push'
                    }
                }
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
            echo 'Build, Docker Hub Push, and Deployment successful.' 
        } 
        failure { 
            echo 'Pipeline failed — check console output.' 
        } 
    }
}