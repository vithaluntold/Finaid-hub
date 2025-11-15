const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting test runner with server management...\n');

// Start the server as a detached process
const serverProcess = spawn('node', ['server.js'], {
  cwd: __dirname,
  detached: false,
  stdio: 'pipe'
});

let serverReady = false;

serverProcess.stdout.on('data', (data) => {
  const output = data.toString();
  console.log(output);
  
  if (output.includes('Server ready to accept connections')) {
    serverReady = true;
    console.log('\n⏳ Waiting 2 seconds for server to stabilize...\n');
    
    setTimeout(() => {
      console.log('🧪 Running API tests...\n');
      
      const testProcess = spawn('node', ['test-api.js'], {
        cwd: __dirname,
        stdio: 'inherit'
      });
      
      testProcess.on('close', (code) => {
        console.log(`\n✅ Tests completed with exit code ${code}`);
        console.log('🛑 Shutting down server...\n');
        
        // Kill the server process
        serverProcess.kill('SIGTERM');
        
        setTimeout(() => {
          process.exit(code);
        }, 1000);
      });
      
      testProcess.on('error', (error) => {
        console.error('❌ Error running tests:', error);
        serverProcess.kill('SIGTERM');
        process.exit(1);
      });
    }, 2000);
  }
});

serverProcess.stderr.on('data', (data) => {
  console.error(data.toString());
});

serverProcess.on('error', (error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});

serverProcess.on('close', (code) => {
  if (!serverReady) {
    console.error(`❌ Server process exited with code ${code} before becoming ready`);
    process.exit(1);
  }
});

// Handle interrupts
process.on('SIGINT', () => {
  console.log('\n🛑 Received interrupt, shutting down...');
  serverProcess.kill('SIGTERM');
  setTimeout(() => process.exit(0), 1000);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Received termination signal, shutting down...');
  serverProcess.kill('SIGTERM');
  setTimeout(() => process.exit(0), 1000);
});
