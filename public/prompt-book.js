// JavaScript for the Prompt Book page

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the tech stack animation
    initTechStackAnimation();
    // Initialize the architecture visualization
    initArchitectureVisualization();
});

// Function to initialize the tech stack animation
function initTechStackAnimation() {
    // Get all tech items
    const techItems = document.querySelectorAll('.tech-item');

    // Add click event listeners to each tech item
    techItems.forEach(item => {
        item.addEventListener('click', function() {
            // Get the tech name
            const techName = this.getAttribute('data-tech');

            // Add a pulse animation class
            this.classList.add('tech-pulse');

            // Remove the class after animation completes
            setTimeout(() => {
                this.classList.remove('tech-pulse');
            }, 700);

            // Show the architecture visualization
            showArchitecture(techName);
        });
    });
}

// Function to initialize the architecture visualization
function initArchitectureVisualization() {
    // Get the architecture container and close button
    const architectureContainer = document.querySelector('.data-architecture-container');
    const closeButton = document.querySelector('.close-architecture');

    // Add click event listener to close button
    closeButton.addEventListener('click', function() {
        // Hide the architecture container
        architectureContainer.classList.remove('active');

        // Clear any active flows
        clearDataFlows();
    });

    // Initialize SVG for data flow paths
    initSVGPaths();
}

// Function to show the architecture visualization for a specific tech
function showArchitecture(techName) {
    // Get the architecture container
    const architectureContainer = document.querySelector('.data-architecture-container');

    // Show the architecture container
    architectureContainer.classList.add('active');

    // Update the description based on the selected tech
    updateArchitectureDescription(techName);

    // Clear any existing data flows
    clearDataFlows();

    // Show the data flow for the selected tech
    setTimeout(() => {
        showDataFlow(techName);
    }, 500);
}

// Function to update the architecture description
function updateArchitectureDescription(techName) {
    // Get the description element
    const descriptionElement = document.querySelector('.arch-description-text');

    // Tech-specific descriptions
    const descriptions = {
        'AI': 'Artificial Intelligence powers our core processing pipeline, enabling intelligent decision-making and adaptive responses based on user inputs and contextual data.',
        'ML': 'Machine Learning models continuously analyze patterns in data, improving response quality and enabling predictive capabilities across our system.',
        'NLP': 'Natural Language Processing breaks down user text into meaningful components, extracting intent, entities, and sentiment to drive understanding.',
        'LLM': 'Large Language Models form the foundation of our text generation system, creating coherent, contextually relevant responses based on processed inputs.',
        'API': 'Our API Gateway manages all external connections, ensuring secure and efficient data exchange between components and third-party services.',
        'Cloud': 'Cloud infrastructure provides scalable computing resources, enabling real-time processing and seamless service delivery.',
        'AccComp': 'Accelerated Computing with our Llama software delivers high-performance processing for visual intelligence tasks, enabling real-time analysis and understanding of visual data.'
    };

    // Update the description text
    descriptionElement.textContent = descriptions[techName] || 'Select a technology component to see how data flows through our system.';
}

// Function to initialize SVG paths for data flow
function initSVGPaths() {
    // Get the SVG element
    const svg = document.getElementById('flow-svg');

    // Clear any existing paths
    svg.innerHTML = '';

    // Define the data flow paths
    const paths = {
        // AI flows
        'ai-input-nlp': createPath('user-input', 'nlp-engine'),
        'ai-apis-nlp': createPath('external-apis', 'nlp-engine'),
        'ai-db-ml': createPath('databases', 'ml-models'),
        'ai-nlp-llm': createPath('nlp-engine', 'llm-core'),
        'ai-ml-llm': createPath('ml-models', 'llm-core'),
        'ai-llm-api': createPath('llm-core', 'api-gateway'),
        'ai-llm-response': createPath('llm-core', 'response-generation'),
        'ai-response-ui': createPath('response-generation', 'user-interface'),

        // ML flows
        'ml-input-ml': createPath('user-input', 'ml-models'),
        'ml-apis-ml': createPath('external-apis', 'ml-models'),
        'ml-db-ml': createPath('databases', 'ml-models'),
        'ml-ml-api': createPath('ml-models', 'api-gateway'),
        'ml-ml-llm': createPath('ml-models', 'llm-core'),
        'ml-llm-response': createPath('llm-core', 'response-generation'),
        'ml-response-ui': createPath('response-generation', 'user-interface'),

        // NLP flows
        'nlp-input-nlp': createPath('user-input', 'nlp-engine'),
        'nlp-apis-nlp': createPath('external-apis', 'nlp-engine'),
        'nlp-nlp-ml': createPath('nlp-engine', 'ml-models'),
        'nlp-nlp-llm': createPath('nlp-engine', 'llm-core'),
        'nlp-llm-response': createPath('llm-core', 'response-generation'),
        'nlp-response-ui': createPath('response-generation', 'user-interface'),

        // LLM flows
        'llm-input-nlp': createPath('user-input', 'nlp-engine'),
        'llm-nlp-llm': createPath('nlp-engine', 'llm-core'),
        'llm-db-llm': createPath('databases', 'llm-core'),
        'llm-llm-response': createPath('llm-core', 'response-generation'),
        'llm-llm-api': createPath('llm-core', 'api-gateway'),
        'llm-response-ui': createPath('response-generation', 'user-interface'),

        // API flows
        'api-input-api': createPath('user-input', 'api-gateway'),
        'api-apis-api': createPath('external-apis', 'api-gateway'),
        'api-api-cloud': createPath('api-gateway', 'cloud-services'),
        'api-cloud-llm': createPath('cloud-services', 'llm-core'),
        'api-llm-response': createPath('llm-core', 'response-generation'),
        'api-response-ui': createPath('response-generation', 'user-interface'),

        // Cloud flows
        'cloud-input-cloud': createPath('user-input', 'cloud-services'),
        'cloud-apis-cloud': createPath('external-apis', 'cloud-services'),
        'cloud-db-cloud': createPath('databases', 'cloud-services'),
        'cloud-cloud-api': createPath('cloud-services', 'api-gateway'),
        'cloud-api-llm': createPath('api-gateway', 'llm-core'),
        'cloud-llm-response': createPath('llm-core', 'response-generation'),
        'cloud-response-ui': createPath('response-generation', 'user-interface'),

        // AccComp flows (Accelerated Computing)
        'acccomp-input-ml': createPath('user-input', 'ml-models'),
        'acccomp-apis-ml': createPath('external-apis', 'ml-models'),
        'acccomp-db-ml': createPath('databases', 'ml-models'),
        'acccomp-ml-llm': createPath('ml-models', 'llm-core'),
        'acccomp-llm-api': createPath('llm-core', 'api-gateway'),
        'acccomp-api-cloud': createPath('api-gateway', 'cloud-services'),
        'acccomp-llm-response': createPath('llm-core', 'response-generation'),
        'acccomp-response-ui': createPath('response-generation', 'user-interface')
    };

    // Add all paths to the SVG
    for (const key in paths) {
        svg.appendChild(paths[key]);
    }
}

// Function to create an SVG path between two nodes
function createPath(fromNodeId, toNodeId) {
    // Get the nodes
    const fromNode = document.getElementById(fromNodeId);
    const toNode = document.getElementById(toNodeId);

    // Get the positions of the nodes
    const fromRect = fromNode.getBoundingClientRect();
    const toRect = toNode.getBoundingClientRect();

    // Get the container position
    const containerRect = document.querySelector('.architecture-diagram').getBoundingClientRect();

    // Calculate the center points relative to the container
    const fromX = (fromRect.left + fromRect.width / 2) - containerRect.left;
    const fromY = (fromRect.top + fromRect.height / 2) - containerRect.top;
    const toX = (toRect.left + toRect.width / 2) - containerRect.left;
    const toY = (toRect.top + toRect.height / 2) - containerRect.top;

    // Create the path element
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

    // Set the path attributes
    path.setAttribute('id', `path-${fromNodeId}-${toNodeId}`);
    path.setAttribute('d', `M ${fromX} ${fromY} C ${(fromX + toX) / 2} ${fromY}, ${(fromX + toX) / 2} ${toY}, ${toX} ${toY}`);
    path.setAttribute('stroke', 'rgba(255, 255, 255, 0.2)');
    path.setAttribute('stroke-width', '1.5');
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke-dasharray', '5');
    path.setAttribute('class', `flow-path ${fromNodeId}-path ${toNodeId}-path`);
    path.style.opacity = '0.2';

    return path;
}

// Function to show data flow for a specific tech
function showDataFlow(techName) {
    // Get all paths
    const paths = document.querySelectorAll('.flow-path');

    // Hide all paths initially
    paths.forEach(path => {
        path.style.opacity = '0.1';
        path.style.strokeWidth = '1';
    });

    // Get the relevant paths based on the tech name
    const relevantPaths = document.querySelectorAll(`[id^="path-${techName.toLowerCase()}-"]`);

    // Show the relevant paths
    relevantPaths.forEach(path => {
        path.style.opacity = '0.8';
        path.style.strokeWidth = '2';
        path.style.stroke = getGradientColor(techName);
    });

    // Highlight the relevant nodes
    highlightNodes(techName);

    // Animate data packets along the paths
    animateDataPackets(techName);
}

// Function to highlight nodes based on the selected tech
function highlightNodes(techName) {
    // Clear any existing highlights
    const allNodes = document.querySelectorAll('.arch-node');
    allNodes.forEach(node => {
        node.classList.remove('active');
    });

    // Define which nodes to highlight for each tech
    const nodeMap = {
        'AI': ['user-input', 'external-apis', 'databases', 'nlp-engine', 'ml-models', 'llm-core', 'response-generation', 'user-interface'],
        'ML': ['user-input', 'external-apis', 'databases', 'ml-models', 'llm-core', 'response-generation', 'user-interface'],
        'NLP': ['user-input', 'external-apis', 'nlp-engine', 'ml-models', 'llm-core', 'response-generation', 'user-interface'],
        'LLM': ['user-input', 'nlp-engine', 'databases', 'llm-core', 'api-gateway', 'response-generation', 'user-interface'],
        'API': ['user-input', 'external-apis', 'api-gateway', 'cloud-services', 'llm-core', 'response-generation', 'user-interface'],
        'Cloud': ['user-input', 'external-apis', 'databases', 'cloud-services', 'api-gateway', 'llm-core', 'response-generation', 'user-interface'],
        'AccComp': ['user-input', 'external-apis', 'databases', 'ml-models', 'llm-core', 'api-gateway', 'cloud-services', 'response-generation', 'user-interface']
    };

    // Highlight the relevant nodes
    const nodesToHighlight = nodeMap[techName] || [];
    nodesToHighlight.forEach(nodeId => {
        const node = document.getElementById(nodeId);
        if (node) {
            node.classList.add('active');
        }
    });
}

// Function to animate data packets along the paths
function animateDataPackets(techName) {
    // Clear any existing data packets
    clearDataPackets();

    // Get the relevant paths
    const relevantPaths = document.querySelectorAll(`[id^="path-${techName.toLowerCase()}-"]`);

    // Create and animate data packets for each path
    relevantPaths.forEach(path => {
        // Create multiple data packets per path with different delays
        for (let i = 0; i < 3; i++) {
            createDataPacket(path, i * 2000);
        }
    });
}

// Function to create and animate a data packet along a path
function createDataPacket(path, delay) {
    // Create a data packet element
    const packet = document.createElement('div');
    packet.className = 'data-packet';
    document.querySelector('.data-packets').appendChild(packet);

    // Get the path length for animation
    const pathLength = path.getTotalLength();

    // Set the initial position
    const startPoint = path.getPointAtLength(0);
    packet.style.left = startPoint.x + 'px';
    packet.style.top = startPoint.y + 'px';

    // Set the color based on the path
    const pathId = path.getAttribute('id');
    const techName = pathId.split('-')[1].toUpperCase();
    packet.style.backgroundColor = getGradientColor(techName);
    packet.style.boxShadow = `0 0 10px ${getGradientColor(techName)}`;

    // Animate the packet along the path
    setTimeout(() => {
        // Make the packet visible
        packet.style.opacity = '1';

        // Animate along the path
        let progress = 0;
        const animationDuration = 3000; // 3 seconds
        const startTime = performance.now();

        function animatePacket(timestamp) {
            // Calculate progress
            const elapsed = timestamp - startTime;
            progress = elapsed / animationDuration;

            if (progress >= 1) {
                // Animation complete, remove the packet
                packet.remove();
                return;
            }

            // Get the point along the path
            const point = path.getPointAtLength(progress * pathLength);

            // Update the packet position
            packet.style.left = point.x + 'px';
            packet.style.top = point.y + 'px';

            // Continue the animation
            requestAnimationFrame(animatePacket);
        }

        // Start the animation
        requestAnimationFrame(animatePacket);
    }, delay);
}

// Function to clear all data packets
function clearDataPackets() {
    const packetsContainer = document.querySelector('.data-packets');
    if (packetsContainer) {
        packetsContainer.innerHTML = '';
    }
}

// Function to clear all data flows
function clearDataFlows() {
    // Reset all paths
    const paths = document.querySelectorAll('.flow-path');
    paths.forEach(path => {
        path.style.opacity = '0.2';
        path.style.strokeWidth = '1.5';
        path.style.stroke = 'rgba(255, 255, 255, 0.2)';
    });

    // Clear node highlights
    const allNodes = document.querySelectorAll('.arch-node');
    allNodes.forEach(node => {
        node.classList.remove('active');
    });

    // Clear data packets
    clearDataPackets();
}

// Function to get gradient color based on tech name
function getGradientColor(techName) {
    const colorMap = {
        'AI': 'var(--gradient-1)',
        'ML': 'var(--gradient-2)',
        'NLP': 'var(--gradient-3)',
        'LLM': 'var(--gradient-1)',
        'API': 'var(--gradient-2)',
        'Cloud': 'var(--gradient-3)',
        'AccComp': 'var(--gradient-1)'
    };

    return colorMap[techName] || 'var(--gradient-2)';
}

// Function to show information about the selected tech (tooltip version)
function showTechInfo(techName, element) {
    // Tech descriptions
    const techInfo = {
        'AI': 'Artificial Intelligence - Click to see architecture',
        'ML': 'Machine Learning - Click to see architecture',
        'NLP': 'Natural Language Processing - Click to see architecture',
        'LLM': 'Large Language Models - Click to see architecture',
        'API': 'Application Programming Interfaces - Click to see architecture',
        'Cloud': 'Cloud Computing - Click to see architecture',
        'AccComp': 'Accelerated Computing - Llama & Visual Intelligence - Click to see architecture'
    };

    // Create or update tooltip
    let tooltip = document.querySelector('.tech-tooltip');

    // If tooltip doesn't exist, create it
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.className = 'tech-tooltip';
        document.querySelector('.tech-stack-container').appendChild(tooltip);
    }

    // Set tooltip content
    tooltip.textContent = techInfo[techName] || `${techName} Technology - Click to see architecture`;

    // Position the tooltip
    const rect = element.getBoundingClientRect();
    const containerRect = document.querySelector('.tech-stack-container').getBoundingClientRect();

    tooltip.style.top = (rect.bottom - containerRect.top + 10) + 'px';
    tooltip.style.left = (rect.left - containerRect.left + (rect.width / 2)) + 'px';

    // Show the tooltip
    tooltip.classList.add('show');

    // Hide the tooltip after a delay
    setTimeout(() => {
        tooltip.classList.remove('show');
    }, 3000);
}
