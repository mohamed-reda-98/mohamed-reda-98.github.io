// ==================== LEVELING SYSTEM (UPDATED WITH NEW RP PATTERN) ====================
        
        // Updated RP calculation matching your exact progression table
        function calculateRPForLevel(level) {
            if (level < 1) return 0;
            
            let totalRP = 0;
            
            for (let i = 1; i <= level; i++) {
                if (i === 1) {
                    totalRP += 800;
                } else if (i === 2) {
                    totalRP += 1300;
                } else if (i === 3) {
                    totalRP += 1700;
                } else if (i === 4) {
                    totalRP += 2300;
                } else if (i === 5) {
                    totalRP += 3400;
                } else if (i === 6) {
                    totalRP += 3000;
                } else if (i === 7) {
                    totalRP += 3500;
                } else if (i === 8) {
                    totalRP += 3800;
                } else if (i === 9) {
                    totalRP += 4200;
                } else if (i === 10) {
                    totalRP += 4500;
                } else if (i <= 99) {
                    // For levels 11-99, gradual increment (simplified estimate)
                    totalRP += 4500 + (i - 10) * 100;
                } else {
                    // For levels 100+, increment by 50 RP per level
                    totalRP += 28600 + (i - 100) * 50;
                }
            }
            
            return totalRP;
        }

        function getRPToNextLevel(level) {
            if (level < 1) return 0;
            if (level === 1) return 800;
            if (level === 2) return 1300;
            if (level === 3) return 1700;
            if (level === 4) return 2300;
            if (level === 5) return 3400;
            if (level === 6) return 3000;
            if (level === 7) return 3500;
            if (level === 8) return 3800;
            if (level === 9) return 4200;
            if (level === 10) return 4500;
            if (level <= 99) return 4500 + (level - 10) * 100;
            return 28600 + (level - 100) * 50;
        }

        function findLevelFromRP(currentRP) {
            for (let level = 1; level <= 200; level++) {
                let rpForLevel = calculateRPForLevel(level);
                let rpForNextLevel = calculateRPForLevel(level + 1);
                
                if (currentRP >= rpForLevel && currentRP < rpForNextLevel) {
                    return level;
                }
            }
            return 200; // Max level
        }

        function toggleInputMode() {
            const mode = document.querySelector('input[name="inputMode"]:checked').value;
            const levelSection = document.getElementById('levelInputSection');
            const manualSection = document.getElementById('manualInputSection');

            if (mode === 'level') {
                levelSection.classList.add('active');
                manualSection.classList.remove('active');
            } else {
                levelSection.classList.remove('active');
                manualSection.classList.add('active');
            }
        }

        function calculateLeveling() {
            const mode = document.querySelector('input[name="inputMode"]:checked').value;
            let currentLevel, currentRP;
            const targetLevel = parseInt(document.getElementById('targetLevel').value);

            if (mode === 'level') {
                currentLevel = parseInt(document.getElementById('currentLevel').value);
                if (!currentLevel || currentLevel < 1 || currentLevel > 200) {
                    alert('الرجاء إدخال مستوى صحيح (1-200)');
                    return;
                }
                currentRP = calculateRPForLevel(currentLevel);
            } else {
                currentRP = parseInt(document.getElementById('manualCurrentRP').value);
                if (isNaN(currentRP) || currentRP < 0) {
                    alert('الرجاء إدخال نقاط الخبرة الحالية');
                    return;
                }
                currentLevel = findLevelFromRP(currentRP);
            }

            if (!targetLevel || targetLevel < 1 || targetLevel > 200) {
                alert('الرجاء إدخال مستوى مطلوب صحيح (1-200)');
                return;
            }

            const targetRP = calculateRPForLevel(targetLevel);

            if (targetRP <= currentRP) {
                alert('المستوى المطلوب يجب أن يكون أعلى من مستواك الحالي');
                return;
            }

            const remainingRP = targetRP - currentRP;
            
            // Calculate progress within CURRENT level (towards NEXT level)
            const currentLevelStartRP = calculateRPForLevel(currentLevel);
            const nextLevelStartRP = calculateRPForLevel(currentLevel + 1);
            const rpInCurrentLevel = currentRP - currentLevelStartRP;
            const rpNeededForNextLevel = nextLevelStartRP - currentLevelStartRP;
            let progressPercentage = (rpInCurrentLevel / rpNeededForNextLevel) * 100;

            if (currentLevel >= 200) {
                progressPercentage = 100;
            }

            // Update result display
            document.getElementById('resultCurrentLevel').textContent = currentLevel;
            document.getElementById('resultTargetLevel').textContent = targetLevel;
            document.getElementById('resultCurrentRP').textContent = currentRP.toLocaleString();
            document.getElementById('resultTargetRP').textContent = targetRP.toLocaleString();
            document.getElementById('resultRemainingRP').textContent = remainingRP.toLocaleString();
            
            // Update progress bar
            const progressBar = document.getElementById('progressBar');
            progressBar.style.width = Math.max(5, Math.min(100, progressPercentage)) + '%';
            progressBar.textContent = progressPercentage.toFixed(1) + '%';

            // Show result
            document.getElementById('levelResult').classList.add('active');
        }

        // ==================== CALCULATOR SYSTEM ====================
        function switchTab(tabName) {
            const tabs = document.querySelectorAll('.tab-content');
            const btns = document.querySelectorAll('.tab-btn');
            
            tabs.forEach(tab => tab.classList.remove('active'));
            btns.forEach(btn => btn.classList.remove('active'));
            
            if (tabName === 'clock') {
                document.getElementById('clockTab').classList.add('active');
                btns[2].classList.add('active');
            } else if (tabName === 'calculator') {
                document.getElementById('calculatorTab').classList.add('active');
                btns[0].classList.add('active');
            } else if (tabName === 'leveling') {
                document.getElementById('levelingTab').classList.add('active');
                btns[1].classList.add('active');
            }
        }

        function toggleEquipment(jobName) {
            const checkbox = document.getElementById(`equip-${jobName}`);
            const inputs = document.getElementById(`equip-inputs-${jobName}`);
            
            if (checkbox.checked) {
                inputs.classList.add('active');
            } else {
                inputs.classList.remove('active');
            }
        }

        function toggleBills(jobName) {
            const checkbox = document.getElementById(`bills-${jobName}`);
            const inputs = document.getElementById(`bills-inputs-${jobName}`);
            
            if (checkbox.checked) {
                inputs.classList.add('active');
            } else {
                inputs.classList.remove('active');
            }
        }

        function getEquipmentCost(jobName) {
            const checkbox = document.getElementById(`equip-${jobName}`);
            if (!checkbox || !checkbox.checked) {
                return 0;
            }

            const priceInput = document.querySelector(`input.equipment-price[data-equip-job="${jobName}"]`);
            const countInput = document.querySelector(`input.equipment-count[data-equip-job="${jobName}"]`);
            
            const price = parseFloat(priceInput?.value) || 0;
            const count = parseFloat(countInput?.value) || 0;
            
            return price * count;
        }

        function getBillsCost(jobName) {
            const checkbox = document.getElementById(`bills-${jobName}`);
            if (!checkbox || !checkbox.checked) {
                return 0;
            }

            const priceInput = document.querySelector(`input.bills-price[data-bills-job="${jobName}"]`);
            const price = parseFloat(priceInput?.value) || 0;
            
            return price;
        }

        function calculateJob(inputElement) {
            const quantity = parseInt(inputElement.value) || 0;
            const money = parseFloat(inputElement.dataset.money) || 0;
            const xp = parseFloat(inputElement.dataset.xp) || 0;
            const jobName = inputElement.dataset.job;

            const totalMoney = quantity * money;
            const totalXP = quantity * xp;
            const equipmentCost = getEquipmentCost(jobName);
            const billsCost = getBillsCost(jobName);
            const netProfit = totalMoney - equipmentCost - billsCost;

            // Update individual job result
            const resultDiv = document.getElementById(`result-${jobName}`);
            const moneyDisplay = document.getElementById(`money-${jobName}`);
            const xpDisplay = document.getElementById(`xp-${jobName}`);
            const equipCostDiv = document.getElementById(`equip-cost-${jobName}`);
            const equipValueDisplay = document.getElementById(`equip-value-${jobName}`);
            const billsCostDiv = document.getElementById(`bills-cost-${jobName}`);
            const billsValueDisplay = document.getElementById(`bills-value-${jobName}`);
            const netProfitDiv = document.getElementById(`net-profit-${jobName}`);
            const netValueDisplay = document.getElementById(`net-value-${jobName}`);

            if (quantity > 0) {
                resultDiv.classList.add('active');
                moneyDisplay.textContent = totalMoney.toLocaleString();
                xpDisplay.textContent = totalXP.toLocaleString();
                
                if (equipmentCost > 0) {
                    equipCostDiv.style.display = 'block';
                    equipValueDisplay.textContent = equipmentCost.toLocaleString();
                } else {
                    equipCostDiv.style.display = 'none';
                }

                if (billsCost > 0) {
                    billsCostDiv.style.display = 'block';
                    billsValueDisplay.textContent = billsCost.toLocaleString();
                } else {
                    billsCostDiv.style.display = 'none';
                }

                if (equipmentCost > 0 || billsCost > 0) {
                    netProfitDiv.style.display = 'block';
                    netValueDisplay.textContent = netProfit.toLocaleString();
                } else {
                    netProfitDiv.style.display = 'none';
                }
            } else {
                resultDiv.classList.remove('active');
            }

            // Update grand totals
            calculateGrandTotals();
        }

        function calculateMinerals() {
            let totalMineralMoney = 0;
            let totalMineralXP = 0;

            // Get all mineral inputs
            const mineralInputs = document.querySelectorAll('input[data-job="mineral"]');
            
            mineralInputs.forEach(input => {
                const quantity = parseInt(input.value) || 0;
                const money = parseFloat(input.dataset.money) || 0;
                const xp = parseFloat(input.dataset.xp) || 0;

                totalMineralMoney += quantity * money;
                totalMineralXP += quantity * xp;
            });

            const equipmentCost = getEquipmentCost('mineral');
            const billsCost = getBillsCost('mineral');
            const netProfit = totalMineralMoney - equipmentCost - billsCost;

            // Update combined minerals result
            const resultDiv = document.getElementById('result-minerals');
            const moneyDisplay = document.getElementById('money-minerals');
            const xpDisplay = document.getElementById('xp-minerals');
            const equipCostDiv = document.getElementById('equip-cost-mineral');
            const equipValueDisplay = document.getElementById('equip-value-mineral');
            const billsCostDiv = document.getElementById('bills-cost-mineral');
            const billsValueDisplay = document.getElementById('bills-value-mineral');
            const netProfitDiv = document.getElementById('net-profit-mineral');
            const netValueDisplay = document.getElementById('net-value-mineral');

            if (totalMineralMoney > 0 || totalMineralXP > 0) {
                resultDiv.classList.add('active');
                moneyDisplay.textContent = totalMineralMoney.toLocaleString();
                xpDisplay.textContent = totalMineralXP.toLocaleString();
                
                if (equipmentCost > 0) {
                    equipCostDiv.style.display = 'block';
                    equipValueDisplay.textContent = equipmentCost.toLocaleString();
                } else {
                    equipCostDiv.style.display = 'none';
                }

                if (billsCost > 0) {
                    billsCostDiv.style.display = 'block';
                    billsValueDisplay.textContent = billsCost.toLocaleString();
                } else {
                    billsCostDiv.style.display = 'none';
                }

                if (equipmentCost > 0 || billsCost > 0) {
                    netProfitDiv.style.display = 'block';
                    netValueDisplay.textContent = netProfit.toLocaleString();
                } else {
                    netProfitDiv.style.display = 'none';
                }
            } else {
                resultDiv.classList.remove('active');
            }

            // Update grand totals
            calculateGrandTotals();
        }

        function calculateGrandTotals() {
            let grandTotalMoney = 0;
            let grandTotalXP = 0;
            let grandTotalEquipment = 0;
            let grandTotalBills = 0;

            const inputs = document.querySelectorAll('.quantity-input');
            inputs.forEach(input => {
                const quantity = parseInt(input.value) || 0;
                const money = parseFloat(input.dataset.money) || 0;
                const xp = parseFloat(input.dataset.xp) || 0;

                grandTotalMoney += quantity * money;
                grandTotalXP += quantity * xp;
            });

            // Calculate total equipment costs and bills
            const jobNames = ['port', 'farm', 'poultry', 'wood', 'fish', 'fabric', 'oil', 'mineral'];
            jobNames.forEach(job => {
                grandTotalEquipment += getEquipmentCost(job);
                grandTotalBills += getBillsCost(job);
            });

            const grandNetProfit = grandTotalMoney - grandTotalEquipment - grandTotalBills;

            document.getElementById('totalMoney').textContent = grandTotalMoney.toLocaleString();
            document.getElementById('totalXP').textContent = grandTotalXP.toLocaleString();
            document.getElementById('totalEquipment').textContent = grandTotalEquipment.toLocaleString();
            document.getElementById('totalBills').textContent = grandTotalBills.toLocaleString();
            document.getElementById('totalNetProfit').textContent = grandNetProfit.toLocaleString();
        }

        function resetCalculator() {
            const inputs = document.querySelectorAll('.quantity-input, .equipment-price, .equipment-count, .bills-price');
            inputs.forEach(input => {
                input.value = 0;
            });
            
            const checkboxes = document.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                checkbox.checked = false;
            });

            const equipInputs = document.querySelectorAll('.equipment-inputs, .bills-inputs');
            equipInputs.forEach(input => {
                input.classList.remove('active');
            });
            
            // Hide all individual results
            const results = document.querySelectorAll('.job-result');
            results.forEach(result => {
                result.classList.remove('active');
            });
            
            calculateGrandTotals();
        }

        // ==================== CLOCK SYSTEM ====================
        let referenceGameMinutes = 0;
        let referenceRealTime = 0;
        let conversionRatio = 0;
        let clockInterval = null;
        let realTimeInterval = null;
        let portStateOverride = null;
        let lastHour = -1;

        function parseTime(timeStr, period) {
            const parts = timeStr.split(':').map(p => p.trim());
            let hours = parseInt(parts[0]) || 0;
            const minutes = parseInt(parts[1]) || 0;

            if (hours < 1 || hours > 12) {
                throw new Error('Hours must be between 1 and 12');
            }

            if (period === 'AM') {
                if (hours === 12) {
                    hours = 0;
                }
            } else {
                if (hours !== 12) {
                    hours += 12;
                }
            }

            return hours * 60 + minutes;
        }

        function formatGameTime(totalMinutes) {
            totalMinutes = totalMinutes % (24 * 60);
            if (totalMinutes < 0) totalMinutes += 24 * 60;

            const hours24 = Math.floor(totalMinutes / 60);
            const minutes = Math.floor(totalMinutes % 60);
            const seconds = Math.floor((totalMinutes % 1) * 60);

            const hours12 = hours24 % 12 || 12;
            const period = hours24 < 12 ? 'AM' : 'PM';

            return {
                time: `${String(hours12).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`,
                period: period,
                hours24: hours24,
                totalMinutes: totalMinutes
            };
        }

        function calculatePortChangeTime(currentGameMinutes, isPortOpen) {
            const currentHour = Math.floor(currentGameMinutes / 60) % 24;
            let minutesUntilChange;

            if (isPortOpen) {
                minutesUntilChange = (19 - currentHour) * 60 - (currentGameMinutes % 60);
            } else {
                if (currentHour >= 19) {
                    minutesUntilChange = (24 - currentHour + 7) * 60 - (currentGameMinutes % 60);
                } else if (currentHour < 7) {
                    minutesUntilChange = (7 - currentHour) * 60 - (currentGameMinutes % 60);
                }
            }

            const realMinutesUntilChange = minutesUntilChange / conversionRatio;
            const changeTime = new Date(Date.now() + realMinutesUntilChange * 60 * 1000);

            return {
                realMinutes: realMinutesUntilChange,
                changeTime: changeTime
            };
        }

        function formatRealTime(date) {
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');
            return `${hours}:${minutes}:${seconds}`;
        }

        function formatCountdownTime(minutes) {
            const hours = Math.floor(minutes / 60);
            const mins = Math.floor(minutes % 60);
            const secs = Math.floor((minutes % 1) * 60);

            if (hours > 0) {
                return `${hours}h ${mins}m ${secs}s`;
            } else if (mins > 0) {
                return `${mins}m ${secs}s`;
            } else {
                return `${secs}s`;
            }
        }

        function togglePortState() {
            const toggleBtn = document.getElementById('togglePortBtn');
            
            if (portStateOverride === null) {
                const portStatusText = document.getElementById('portStatus').textContent;
                portStateOverride = portStatusText.includes('مفتوح') ? false : true;
                toggleBtn.classList.add('active');
                toggleBtn.textContent = '✅ Manual Override Active (Click to Toggle)';
            } else {
                portStateOverride = !portStateOverride;
            }
            
            updatePortStatusManual();
        }

        function updatePortStatusManual() {
            const clockDisplay = document.getElementById('clockDisplay');
            const portStatus = document.getElementById('portStatus');
            const portCountdown = document.getElementById('portCountdown');
            const body = document.body;

            body.classList.remove('port-closed', 'port-warning');
            clockDisplay.classList.remove('port-closed', 'port-warning');

            if (portStateOverride === true) {
                portStatus.textContent = '🟢 الميناء مفتوح';
                portCountdown.style.display = 'none';
            } else if (portStateOverride === false) {
                body.classList.add('port-closed');
                clockDisplay.classList.add('port-closed');
                portStatus.textContent = '🔴 الميناء مغلق';
                portCountdown.style.display = 'none';
            }
        }

        function updatePortStatus(hours24, totalMinutes) {
            if (portStateOverride !== null) {
                if (lastHour !== -1 && lastHour !== hours24) {
                    if (hours24 === 7 || hours24 === 19) {
                        portStateOverride = !portStateOverride;
                    }
                }
                lastHour = hours24;
                updatePortStatusManual();
                return;
            }

            lastHour = hours24;

            const clockDisplay = document.getElementById('clockDisplay');
            const portStatus = document.getElementById('portStatus');
            const portCountdown = document.getElementById('portCountdown');
            const body = document.body;

            const isPortClosed = hours24 >= 19 || hours24 < 7;
            
            const totalMinutesIn24 = hours24 * 60 + (totalMinutes % 60);
            const isClosingWarning = totalMinutesIn24 >= (18 * 60 + 45) && totalMinutesIn24 < (19 * 60);
            const isOpeningWarning = totalMinutesIn24 >= (6 * 60 + 45) && totalMinutesIn24 < (7 * 60);

            body.classList.remove('port-closed', 'port-warning');
            clockDisplay.classList.remove('port-closed', 'port-warning');

            if (isOpeningWarning) {
                body.classList.add('port-warning');
                clockDisplay.classList.add('port-warning');
                portStatus.textContent = '⚠️ الميناء يفتح قريباً';

                const timeInfo = calculatePortChangeTime(totalMinutes, false);
                if (timeInfo) {
                    const countdown = formatCountdownTime(timeInfo.realMinutes);
                    const changeTimeStr = formatRealTime(timeInfo.changeTime);
                    portCountdown.innerHTML = `⚠️ OPENING SOON!<br>⏰ Opens After: ${countdown}<br>🕐 Opening Time(Real Time): ${changeTimeStr}`;
                    portCountdown.style.display = 'block';
                }
            } else if (isClosingWarning) {
                body.classList.add('port-warning');
                clockDisplay.classList.add('port-warning');
                portStatus.textContent = '⚠️ الميناء يغلق قريباً';

                const timeInfo = calculatePortChangeTime(totalMinutes, true);
                if (timeInfo) {
                    const countdown = formatCountdownTime(timeInfo.realMinutes);
                    const changeTimeStr = formatRealTime(timeInfo.changeTime);
                    portCountdown.innerHTML = `⚠️ CLOSING SOON!<br>⏰ Closes After: ${countdown}<br>🕐 Closing Time(Real Time): ${changeTimeStr}`;
                    portCountdown.style.display = 'block';
                }
            } else if (isPortClosed) {
                body.classList.add('port-closed');
                clockDisplay.classList.add('port-closed');
                portStatus.textContent = '🔴 الميناء مغلق';

                const timeInfo = calculatePortChangeTime(totalMinutes, false);
                if (timeInfo) {
                    const countdown = formatCountdownTime(timeInfo.realMinutes);
                    const changeTimeStr = formatRealTime(timeInfo.changeTime);
                    portCountdown.innerHTML = `⏰ Opens After(Real Time): ${countdown}<br>🕐 Opening Time (Real Time): ${changeTimeStr}`;
                    portCountdown.style.display = 'block';
                }
            } else {
                portStatus.textContent = '🟢 الميناء مفتوح';

                const timeInfo = calculatePortChangeTime(totalMinutes, true);
                if (timeInfo) {
                    const countdown = formatCountdownTime(timeInfo.realMinutes);
                    const changeTimeStr = formatRealTime(timeInfo.changeTime);
                    portCountdown.innerHTML = `⏰ Closes After: ${countdown}<br>🕐 Closing Time(Real Time): ${changeTimeStr}`;
                    portCountdown.style.display = 'block';
                }
            }
        }

        function formatElapsedTime(milliseconds) {
            const totalSeconds = Math.floor(milliseconds / 1000);
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;

            if (hours > 0) {
                return `${hours}h ${minutes}m ${seconds}s`;
            } else if (minutes > 0) {
                return `${minutes}m ${seconds}s`;
            } else {
                return `${seconds}s`;
            }
        }

        function startClock() {
            const timeInput = document.getElementById('referenceTime').value;
            const dayHours = parseFloat(document.getElementById('gameDayHours').value);
            const period = document.querySelector('input[name="timePeriod"]:checked').value;

            if (!timeInput || !dayHours || dayHours <= 0) {
                alert('Please enter valid values for both fields');
                return;
            }

            try {
                conversionRatio = 24 / dayHours;
                referenceGameMinutes = parseTime(timeInput, period);
                referenceRealTime = Date.now();

                const startDate = new Date();
                document.getElementById('startTime').textContent = formatRealTime(startDate);

                const realMinPerGameHour = 60 / conversionRatio;

                document.getElementById('conversionInfo').innerHTML = `
                    <strong>⚡ Speed:</strong> 1 real minute = ${conversionRatio.toFixed(4)} game minutes<br>
                    <strong>🔄 Ratio:</strong> 1 real hour = ${conversionRatio.toFixed(2)} game hours<br>
                    <strong>⏱️ Duration:</strong> 1 game hour = ${realMinPerGameHour.toFixed(2)} real minutes<br>
                    <strong>🌍 Full Day:</strong> ${dayHours} real hours = 24 game hours<br>
                    <strong>🚢 Port Hours:</strong> Open 7 AM - 7 PM, Closed 7 PM - 7 AM
                `;

                document.getElementById('setupSection').classList.add('hidden');
                document.getElementById('clockSection').classList.add('active');

                if (clockInterval) clearInterval(clockInterval);
                if (realTimeInterval) clearInterval(realTimeInterval);

                clockInterval = setInterval(updateGameTime, 100);
                realTimeInterval = setInterval(updateRealTime, 1000);

                updateGameTime();
                updateRealTime();
            } catch (error) {
                alert('Please enter a valid time (HH:MM format, hours between 1-12)');
            }
        }

        function updateGameTime() {
            const realMinutesPassed = (Date.now() - referenceRealTime) / (1000 * 60);
            const gameMinutesPassed = realMinutesPassed * conversionRatio;
            const currentGameMinutes = referenceGameMinutes + gameMinutesPassed;

            const formattedTime = formatGameTime(currentGameMinutes);
            document.getElementById('gameTime').textContent = formattedTime.time;
            document.getElementById('gamePeriod').textContent = formattedTime.period;

            updatePortStatus(formattedTime.hours24, formattedTime.totalMinutes);
        }

        function updateRealTime() {
            const now = new Date();
            document.getElementById('realTime').textContent = formatRealTime(now);

            const elapsed = Date.now() - referenceRealTime;
            document.getElementById('elapsedTime').textContent = formatElapsedTime(elapsed);
        }

        function changeSettings() {
            if (clockInterval) clearInterval(clockInterval);
            if (realTimeInterval) clearInterval(realTimeInterval);

            portStateOverride = null;
            lastHour = -1;
            const toggleBtn = document.getElementById('togglePortBtn');
            toggleBtn.classList.remove('active');
            toggleBtn.textContent = '🔄 Toggle Port State (Manual Override)';

            document.getElementById('setupSection').classList.remove('hidden');
            document.getElementById('clockSection').classList.remove('active');
            document.body.classList.remove('port-closed', 'port-warning');
        }

        document.addEventListener('visibilitychange', function() {
            if (!document.hidden && clockInterval) {
                updateGameTime();
                updateRealTime();
            }
        });
