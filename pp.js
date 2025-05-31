
        function showPage(pageNum) {
            const pages = document.querySelectorAll('.page');
            const navBtns = document.querySelectorAll('.nav-btn');
            
            pages.forEach(page => page.classList.remove('active'));
            navBtns.forEach(btn => btn.classList.remove('active'));
            
            pages[pageNum - 1].classList.add('active');
            navBtns[pageNum - 1].classList.add('active');
        }

        function updateGraph() {
            const canvas = document.getElementById('graph');
            const ctx = canvas.getContext('2d');
            
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Set up coordinate system
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const scaleX = 50; // pixels per volt
            const scaleY = 3;  // pixels per mA
            
            // Draw axes
            ctx.strokeStyle = '#172842';
            ctx.lineWidth = 2;
            
            // X-axis
            ctx.beginPath();
            ctx.moveTo(50, centerY);
            ctx.lineTo(canvas.width - 50, centerY);
            ctx.stroke();
            
            // Y-axis  
            ctx.beginPath();
            ctx.moveTo(centerX, 50);
            ctx.lineTo(centerX, canvas.height - 50);
            ctx.stroke();
            
            // Labels
            ctx.fillStyle = '#172842';
            ctx.font = '14px Arial';
            ctx.fillText('Voltage (V)', canvas.width - 100, centerY + 30);
            ctx.save();
            ctx.translate(30, 100);
            ctx.rotate(-Math.PI/2);
            ctx.fillText('Current (mA)', 0, 0);
            ctx.restore();
            
            // Grid lines and scale markers
            ctx.strokeStyle = '#B0BEC5';
            ctx.lineWidth = 1;
            
            // Vertical grid lines (voltage)
            for(let i = -10; i <= 5; i++) {
                const x = centerX + i * scaleX;
                if(x > 50 && x < canvas.width - 50) {
                    ctx.beginPath();
                    ctx.moveTo(x, 50);
                    ctx.lineTo(x, canvas.height - 50);
                    ctx.stroke();
                    
                    if(i !== 0) {
                        ctx.fillStyle = '#2E3A59';
                        ctx.font = '10px Arial';
                        ctx.fillText(i.toString(), x - 5, centerY + 15);
                    }
                }
            }
            
            // Horizontal grid lines (current)
            for(let i = -20; i <= 60; i += 10) {
                const y = centerY - i * scaleY;
                if(y > 50 && y < canvas.height - 50) {
                    ctx.beginPath();
                    ctx.moveTo(50, y);
                    ctx.lineTo(canvas.width - 50, y);
                    ctx.stroke();
                    
                    if(i !== 0) {
                        ctx.fillStyle = '#2E3A59';
                        ctx.font = '10px Arial';
                        ctx.fillText(i.toString(), centerX + 5, y + 3);
                    }
                }
            }
            
            // Plot forward bias points
            ctx.fillStyle = '#00BFA6';
            ctx.strokeStyle = '#00BFA6';
            ctx.lineWidth = 3;
            
            const forwardPoints = [];
            for(let i = 1; i <= 8; i++) {
                const voltage = parseFloat(document.getElementById(`fv${i}`).value) || 0;
                const current = parseFloat(document.getElementById(`fc${i}`).value) || 0;
                
                const x = centerX + voltage * scaleX;
                const y = centerY - current * scaleY;
                
                if(x > 50 && x < canvas.width - 50 && y > 50 && y < canvas.height - 50) {
                    ctx.beginPath();
                    ctx.arc(x, y, 5, 0, 2 * Math.PI);
                    ctx.fill();
                    forwardPoints.push({x, y, voltage, current});
                }
            }
            
            // Draw forward bias curve
            if(forwardPoints.length > 1) {
                ctx.beginPath();
                ctx.moveTo(forwardPoints[0].x, forwardPoints[0].y);
                for(let i = 1; i < forwardPoints.length; i++) {
                    ctx.lineTo(forwardPoints[i].x, forwardPoints[i].y);
                }
                ctx.stroke();
            }
            
            // Plot reverse bias points
            ctx.fillStyle = '#4A90E2';
            ctx.strokeStyle = '#4A90E2';
            
            const reversePoints = [];
            for(let i = 1; i <= 5; i++) {
                const voltage = parseFloat(document.getElementById(`rv${i}`).value) || 0;
                const current = parseFloat(document.getElementById(`rc${i}`).value) || 0;
                
                const x = centerX + voltage * scaleX;
                const y = centerY - current * scaleY;
                
                if(x > 50 && x < canvas.width - 50 && y > 50 && y < canvas.height - 50) {
                    ctx.beginPath();
                    ctx.arc(x, y, 5, 0, 2 * Math.PI);
                    ctx.fill();
                    reversePoints.push({x, y, voltage, current});
                }
            }
            
            // Draw reverse bias curve
            if(reversePoints.length > 1) {
                ctx.beginPath();
                ctx.moveTo(reversePoints[0].x, reversePoints[0].y);
                for(let i = 1; i < reversePoints.length; i++) {
                    ctx.lineTo(reversePoints[i].x, reversePoints[i].y);
                }
                ctx.stroke();
            }
            
            // Legend
            ctx.fillStyle = '#00BFA6';
            ctx.fillRect(canvas.width - 200, 70, 20, 10);
            ctx.fillStyle = '#2E3A59';
            ctx.font = '12px Arial';
            ctx.fillText('Forward Bias', canvas.width - 170, 80);
            
            ctx.fillStyle = '#4A90E2';
            ctx.fillRect(canvas.width - 200, 90, 20, 10);
            ctx.fillStyle = '#2E3A59';
            ctx.fillText('Reverse Bias', canvas.width - 170, 100);
        }

        function clearData() {
            for(let i = 1; i <= 8; i++) {
                document.getElementById(`fv${i}`).value = '';
                document.getElementById(`fc${i}`).value = '';
            }
            for(let i = 1; i <= 5; i++) {
                document.getElementById(`rv${i}`).value = '';
                document.getElementById(`rc${i}`).value = '';
            }
            updateGraph();
        }

        function loadSampleData() {
            // Forward bias sample data
            const forwardData = [
                [0, 0], [0.2, 0.1], [0.4, 0.2], [0.6, 0.5],
                [0.7, 5], [0.8, 15], [0.9, 30], [1.0, 50]
            ];
            
            // Reverse bias sample data
            const reverseData = [
                [-1, -0.1], [-2, -0.2], [-5, -0.5], [-10, -1], [-15, -1.5]
            ];
            
            for(let i = 0; i < forwardData.length; i++) {
                document.getElementById(`fv${i+1}`).value = forwardData[i][0];
                document.getElementById(`fc${i+1}`).value = forwardData[i][1];
            }
            
            for(let i = 0; i < reverseData.length; i++) {
                document.getElementById(`rv${i+1}`).value = reverseData[i][0];
                document.getElementById(`rc${i+1}`).value = reverseData[i][1];
            }
            
            updateGraph();
        }

        // Initialize graph on page load
        window.onload = function() {
            loadSampleData();
        };