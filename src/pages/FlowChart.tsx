import React, { useState } from 'react';

const FullStackFlowchart = () => {
  const [hoveredNode, setHoveredNode] = useState(null);

  const mainFlow = [
    { id: 'html-css', label: 'HTML and CSS', x: 400, y: 100, type: 'main' },
    { id: 'js', label: 'JavaScript', x: 400, y: 200, type: 'main' },
    { id: 'git', label: 'Git and GitHub', x: 400, y: 300, type: 'main' },
    { id: 'nodejs', label: 'Node.js', x: 400, y: 500, type: 'main' },
    { id: 'frameworks', label: 'Frameworks', x: 400, y: 700, type: 'main' },
    { id: 'databases', label: 'Databases', x: 400, y: 900, type: 'main' },
    { id: 'deployment', label: 'Deployment', x: 400, y: 1100, type: 'main' }
  ];

  const leftNodes = [
    { id: 'html', label: 'HTML', x: 150, y: 80, connects: 'html-css', description: 'Learn HTML structure and semantic elements' },
    { id: 'css', label: 'CSS', x: 150, y: 120, connects: 'html-css', description: 'Master styling and layouts' },

    { id: 'html-fund', label: 'HTML Fundamentals', x: 100, y: 180, connects: 'js' },
    { id: 'css-fund', label: 'CSS Fundamentals', x: 100, y: 220, connects: 'js' },
    { id: 'responsive', label: 'Responsive CSS', x: 50, y: 260, connects: 'js' },
    { id: 'css-grid', label: 'CSS Grid', x: 50, y: 300, connects: 'git' },

    { id: 'advanced-js', label: 'Advanced JS', x: 150, y: 380, connects: 'nodejs' },
    { id: 'dom', label: 'DOM', x: 100, y: 420, connects: 'nodejs' },
    { id: 'events', label: 'Events', x: 150, y: 460, connects: 'nodejs' },

    { id: 'templates', label: 'Templates', x: 120, y: 580, connects: 'frameworks' },
    { id: 'functions', label: 'Functions', x: 80, y: 620, connects: 'frameworks' },
    { id: 'modules', label: 'Modules', x: 120, y: 660, connects: 'frameworks' },
    { id: 'async', label: 'Async', x: 80, y: 700, connects: 'frameworks' },

    { id: 'sql', label: 'SQL', x: 150, y: 780, connects: 'databases' },
    { id: 'nosql', label: 'NoSQL', x: 100, y: 820, connects: 'databases' },
    { id: 'mongodb', label: 'MongoDB', x: 150, y: 860, connects: 'databases' },
    { id: 'postgresql', label: 'PostgreSQL', x: 100, y: 900, connects: 'databases' },

    { id: 'docker', label: 'Docker', x: 150, y: 980, connects: 'deployment' },
    { id: 'aws', label: 'AWS', x: 100, y: 1020, connects: 'deployment' },
    { id: 'heroku', label: 'Heroku', x: 150, y: 1060, connects: 'deployment' },
    { id: 'netlify', label: 'Netlify', x: 100, y: 1100, connects: 'deployment' }
  ];

  const rightNodes = [
    { id: 'semantic', label: 'Semantic HTML', x: 650, y: 80, connects: 'html-css', description: 'Use meaningful HTML elements' },
    { id: 'flexbox', label: 'Flexbox', x: 650, y: 120, connects: 'html-css', description: 'Master flexible layouts' },

    { id: 'es6', label: 'ES6+', x: 700, y: 180, connects: 'js' },
    { id: 'webpack', label: 'Webpack', x: 700, y: 220, connects: 'js' },
    { id: 'babel', label: 'Babel', x: 750, y: 260, connects: 'js' },
    { id: 'npm', label: 'NPM', x: 750, y: 300, connects: 'git' },

    { id: 'apis', label: 'Web APIs', x: 650, y: 380, connects: 'nodejs' },
    { id: 'fetch', label: 'Fetch API', x: 700, y: 420, connects: 'nodejs' },
    { id: 'promises', label: 'Promises', x: 650, y: 460, connects: 'nodejs' },

    { id: 'express', label: 'Express.js', x: 680, y: 580, connects: 'frameworks' },
    { id: 'react', label: 'React', x: 720, y: 620, connects: 'frameworks' },
    { id: 'vue', label: 'Vue.js', x: 680, y: 660, connects: 'frameworks' },
    { id: 'angular', label: 'Angular', x: 720, y: 700, connects: 'frameworks' },

    { id: 'redis', label: 'Redis', x: 650, y: 780, connects: 'databases' },
    { id: 'mysql', label: 'MySQL', x: 700, y: 820, connects: 'databases' },
    { id: 'firebase', label: 'Firebase', x: 650, y: 860, connects: 'databases' },
    { id: 'sqlite', label: 'SQLite', x: 700, y: 900, connects: 'databases' },

    { id: 'ci-cd', label: 'CI/CD', x: 650, y: 980, connects: 'deployment' },
    { id: 'kubernetes', label: 'Kubernetes', x: 700, y: 1020, connects: 'deployment' },
    { id: 'nginx', label: 'Nginx', x: 650, y: 1060, connects: 'deployment' },
    { id: 'cloudflare', label: 'Cloudflare', x: 700, y: 1100, connects: 'deployment' }
  ];

  const allNodes = [...mainFlow, ...leftNodes, ...rightNodes];

  const createCurvedPath = (fromNode, toNode, side) => {
    const startX = fromNode.x + (side === 'left' ? 80 : -80);
    const startY = fromNode.y + 15;
    const endX = toNode.x + (side === 'left' ? -80 : 80);
    const endY = toNode.y + 15;

    const midX = (startX + endX) / 2;
    const controlX1 = side === 'left' ? startX + 60 : startX - 60;
    const controlY1 = startY + (endY - startY) * 0.3;
    const controlX2 = side === 'left' ? endX - 60 : endX + 60;
    const controlY2 = endY - (endY - startY) * 0.3;

    return `M ${startX} ${startY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${endX} ${endY}`;
  };

  const createStraightPath = (fromNode, toNode) => {
    const startX = fromNode.x;
    const startY = fromNode.y + 30;
    const endX = toNode.x;
    const endY = toNode.y - 15;

    return `M ${startX} ${startY} L ${endX} ${endY}`;
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="w-full">
        <h1 className="text-4xl font-bold text-center mb-4 text-gray-800">
          Full Stack Learning Path
        </h1>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Your comprehensive roadmap to becoming a full-stack developer
        </p>

        <div className="relative ml-40" style={{ width: '1000px', height: '1200px', margin: '0 auto' }}>
          <svg
            className="absolute inset-0 pointer-events-none"
            width="900"
            height="1200"
            style={{ zIndex: 1 }}
          >
            <defs>
              <marker
                id="arrowhead"
                markerWidth="8"
                markerHeight="6"
                refX="7"
                refY="3"
                orient="auto"
              >
                <polygon
                  points="0 0, 8 3, 0 6"
                  fill="#64748b"
                />
              </marker>
            </defs>
            {mainFlow.slice(0, -1).map((node, index) => {
              const nextNode = mainFlow[index + 1];
              return (
                <path
                  key={`main-${index}`}
                  d={createStraightPath(node, nextNode)}
                  stroke="#64748b"
                  strokeWidth="3"
                  fill="none"
                  markerEnd="url(#arrowhead)"
                />
              );
            })}

            {leftNodes.map((node, index) => {
              const parentNode = mainFlow.find(main => main.id === node.connects);
              if (!parentNode) return null;

              return (
                <path
                  key={`left-${index}`}
                  d={createCurvedPath(node, parentNode, 'left')}
                  stroke="#64748b"
                  strokeWidth="2"
                  fill="none"
                  markerEnd="url(#arrowhead)"
                  className="transition-all duration-300"
                  style={{
                    strokeDasharray: hoveredNode === node.id || hoveredNode === parentNode.id ? '5,5' : 'none',
                    strokeWidth: hoveredNode === node.id || hoveredNode === parentNode.id ? '3' : '2',
                    stroke: hoveredNode === node.id || hoveredNode === parentNode.id ? '#3b82f6' : '#64748b'
                  }}
                />
              );
            })}

            {rightNodes.map((node, index) => {
              const parentNode = mainFlow.find(main => main.id === node.connects);
              if (!parentNode) return null;

              return (
                <path
                  key={`right-${index}`}
                  d={createCurvedPath(node, parentNode, 'right')}
                  stroke="#64748b"
                  strokeWidth="2"
                  fill="none"
                  markerEnd="url(#arrowhead)"
                  className="transition-all duration-300"
                  style={{
                    strokeDasharray: hoveredNode === node.id || hoveredNode === parentNode.id ? '5,5' : 'none',
                    strokeWidth: hoveredNode === node.id || hoveredNode === parentNode.id ? '3' : '2',
                    stroke: hoveredNode === node.id || hoveredNode === parentNode.id ? '#3b82f6' : '#64748b'
                  }}
                />
              );
            })}
          </svg>

          {/* Main flow nodes (center) */}
          {mainFlow.map((node) => (
            <div
              key={node.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 px-6 py-4 rounded-xl border-2 shadow-lg cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 bg-indigo-100 border-indigo-300 text-indigo-800 font-semibold"
              style={{
                left: node.x,
                top: node.y,
                zIndex: 3,
                minWidth: '140px',
                textAlign: 'center'
              }}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
            >
              {node.label}
            </div>
          ))}

          {/* Left side nodes */}
          {leftNodes.map((node) => (
            <div
              key={node.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 px-4 py-2 rounded-lg border-2 shadow-md cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 bg-blue-100 border-blue-300 text-blue-800"
              style={{
                left: node.x,
                top: node.y,
                zIndex: 2,
                minWidth: '100px',
                textAlign: 'center',
                fontSize: '14px'
              }}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
            >
              {node.label}
              {node.description && hoveredNode === node.id && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg whitespace-nowrap z-10">
                  {node.description}
                </div>
              )}
            </div>
          ))}

          {/* Right side nodes */}
          {rightNodes.map((node) => (
            <div
              key={node.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 px-4 py-2 rounded-lg border-2 shadow-md cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 bg-green-100 border-green-300 text-green-800"
              style={{
                left: node.x,
                top: node.y,
                zIndex: 2,
                minWidth: '100px',
                textAlign: 'center',
                fontSize: '14px'
              }}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
            >
              {node.label}
              {node.description && hoveredNode === node.id && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg whitespace-nowrap z-10">
                  {node.description}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FullStackFlowchart;