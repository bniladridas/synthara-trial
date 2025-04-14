/**
 * Utility functions for the application
 */

/**
 * Checks if the current device is a mobile device
 * @returns {boolean} True if the device is mobile, false otherwise
 */
function isMobileDevice() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  
  // Check for mobile devices using common patterns
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  
  return mobileRegex.test(userAgent) || 
         (window.innerWidth <= 800 && window.innerHeight <= 900);
}

/**
 * Triggers vibration with a specific pattern if supported
 * @param {number|number[]} pattern - Vibration duration in ms or pattern array
 * @param {string} type - Type of vibration (used for logging)
 * @returns {boolean} - True if vibration was triggered successfully
 */
function triggerVibration(pattern, type = 'generic') {
  // Only vibrate if the device is mobile and supports vibration
  if (isMobileDevice() && 'vibrate' in navigator) {
    try {
      navigator.vibrate(pattern);
      return true;
    } catch (error) {
      console.warn(`${type} vibration not supported:`, error);
      return false;
    }
  }
  return false;
}

/**
 * Triggers a soft vibration on mobile devices that support it
 * @param {number} duration - Vibration duration in milliseconds (default: 30ms)
 * @returns {boolean} - True if vibration was triggered successfully
 */
function triggerSoftVibration(duration = 30) {
  return triggerVibration(duration, 'soft');
}

/**
 * Triggers a pattern of vibrations for error feedback
 * @returns {boolean} - True if vibration was triggered successfully
 */
function triggerErrorVibration() {
  // Error pattern: short, pause, long
  return triggerVibration([20, 30, 70], 'error');
}

/**
 * Triggers a success vibration pattern
 * @returns {boolean} - True if vibration was triggered successfully
 */
function triggerSuccessVibration() {
  // Success pattern: short, short
  return triggerVibration([30, 20, 30], 'success');
}

// Export the utilities if using modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    isMobileDevice,
    triggerVibration,
    triggerSoftVibration,
    triggerErrorVibration,
    triggerSuccessVibration
  };
}
