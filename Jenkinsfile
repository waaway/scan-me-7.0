pipeline {
  agent any

  tools {
    nodejs 'default-node'
  }

  environment {
    SNYK_TOKEN = credentials('snyk-token')
    STACKHAWK_API_KEY = credentials('stackhawk-api-key')
  }

  stages {
    stage('Install Dependencies') {
      steps {
        sh 'npm install'
      }
    }

    stage('Snyk Security Scan') {
      steps {
        sh 'snyk test'
      }
    }

    stage('StackHawk DAST Scan') {
      steps {
        sh '''
          docker run --rm \
          -v $WORKSPACE:/hawk \
          -e API_KEY=$STACKHAWK_API_KEY \
          stackhawk/hawkscan
        '''
      }
    }

    stage('Test App') {
      steps {
        sh 'npm test || true'
      }
    }

    stage('Deploy') {
      steps {
        echo '✅ Deploy to Vercel... (Manual or via GitHub webhook)'
      }
    }
  }
}
