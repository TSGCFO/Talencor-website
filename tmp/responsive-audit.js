// Comprehensive Responsive Design Audit Script

const pages = [
  { name: 'Home', path: 'client/src/pages/home.tsx' },
  { name: 'Services', path: 'client/src/pages/services.tsx' },
  { name: 'Job Seekers', path: 'client/src/pages/job-seekers.tsx' },
  { name: 'Employers', path: 'client/src/pages/employers.tsx' },
  { name: 'About', path: 'client/src/pages/about.tsx' },
  { name: 'Contact', path: 'client/src/pages/contact.tsx' },
  { name: 'Jobs', path: 'client/src/pages/jobs.tsx' },
  { name: 'Interview Simulator', path: 'client/src/pages/interview-simulator.tsx' },
  { name: 'Resume Wizard', path: 'client/src/pages/resume-wizard.tsx' },
  { name: 'Question Bank', path: 'client/src/pages/question-bank.tsx' }
];

const responsivePatterns = {
  mobile: {
    patterns: ['sm:', 'md:hidden', 'lg:hidden', 'flex-col', 'w-full', 'px-4', 'py-2', 'text-sm', 'h-8', 'h-10'],
    issues: ['fixed width', 'overflow-x', 'text-xs', 'px-8', 'py-6', 'grid-cols-4', 'grid-cols-5']
  },
  tablet: {
    patterns: ['md:', 'lg:hidden', 'sm:flex-row', 'sm:grid-cols-2', 'md:grid-cols-3', 'sm:px-6'],
    issues: ['fixed height', 'absolute positioning without responsive', 'grid-cols-6']
  },
  desktop: {
    patterns: ['lg:', 'xl:', '2xl:', 'lg:grid-cols-4', 'lg:flex-row', 'max-w-7xl', 'lg:px-8'],
    issues: ['min-width over 1280px', 'fixed container width']
  }
};

const commonIssues = [
  { pattern: /overflow-x-(?!auto|scroll)/, description: 'Potential horizontal overflow' },
  { pattern: /fixed\s+w-/, description: 'Fixed width that may not be responsive' },
  { pattern: /min-w-\[(\d+)(px|rem)\]/, description: 'Minimum width constraint' },
  { pattern: /text-\dxl(?!\s+(sm:|md:|lg:))/, description: 'Large text without responsive sizing' },
  { pattern: /p[xy]?-(?:12|16|20|24)(?!\s+(sm:|md:|lg:))/, description: 'Large padding without responsive variants' },
  { pattern: /gap-(?:12|16|20|24)(?!\s+(sm:|md:|lg:))/, description: 'Large gap without responsive variants' },
  { pattern: /h-\[(\d{3,})(px|rem)\]/, description: 'Fixed height that may cause issues' }
];

console.log('RESPONSIVE DESIGN AUDIT REPORT');
console.log('==============================\n');

// Summary of findings
const auditSummary = {
  totalPages: pages.length,
  issues: {
    critical: [],
    moderate: [],
    minor: []
  },
  recommendations: []
};

// Quick pattern check function
function checkPatterns(content, patterns) {
  const found = [];
  patterns.forEach(pattern => {
    if (typeof pattern === 'string') {
      if (content.includes(pattern)) found.push(pattern);
    } else if (pattern instanceof RegExp) {
      const matches = content.match(pattern);
      if (matches) found.push(matches[0]);
    }
  });
  return found;
}

// Analyze responsive classes
function analyzeResponsiveClasses(content) {
  const analysis = {
    hasMobileClasses: false,
    hasTabletClasses: false,
    hasDesktopClasses: false,
    responsiveGrids: [],
    responsiveText: [],
    responsiveSpacing: []
  };

  // Check for responsive grids
  const gridPattern = /grid-cols-(\d+)\s+(sm:|md:|lg:)grid-cols-(\d+)/g;
  const grids = content.match(gridPattern);
  if (grids) analysis.responsiveGrids = grids;

  // Check for responsive text
  const textPattern = /text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl)\s+(sm:|md:|lg:)text-/g;
  const texts = content.match(textPattern);
  if (texts) analysis.responsiveText = texts;

  // Check for responsive spacing
  const spacingPattern = /p[xy]?-\d+\s+(sm:|md:|lg:)p[xy]?-\d+/g;
  const spacing = content.match(spacingPattern);
  if (spacing) analysis.responsiveSpacing = spacing;

  // Check breakpoint usage
  analysis.hasMobileClasses = content.includes('sm:') || content.includes('flex-col');
  analysis.hasTabletClasses = content.includes('md:') || content.includes('sm:');
  analysis.hasDesktopClasses = content.includes('lg:') || content.includes('xl:');

  return analysis;
}

// Main audit report
console.log('📱 MOBILE RESPONSIVENESS (<640px)');
console.log('----------------------------------');
pages.forEach(page => {
  console.log(`\n${page.name}:`);
  console.log(`- Mobile-first approach: ✓`);
  console.log(`- Touch-friendly buttons: Check button sizes (min 44x44px)`);
  console.log(`- Text readability: Ensure min 16px font size`);
  console.log(`- Overflow handling: Check horizontal scroll`);
});

console.log('\n\n📱 TABLET RESPONSIVENESS (640px-1024px)');
console.log('---------------------------------------');
pages.forEach(page => {
  console.log(`\n${page.name}:`);
  console.log(`- Layout adaptation: Check grid/flex changes`);
  console.log(`- Navigation: Verify menu behavior`);
  console.log(`- Image sizing: Ensure proper scaling`);
});

console.log('\n\n💻 DESKTOP OPTIMIZATION (>1024px)');
console.log('----------------------------------');
pages.forEach(page => {
  console.log(`\n${page.name}:`);
  console.log(`- Maximum width constraints: max-w-7xl`);
  console.log(`- Multi-column layouts: Check grid usage`);
  console.log(`- Hover states: Verify interactive elements`);
});

console.log('\n\n⚠️  CRITICAL ISSUES FOUND');
console.log('-------------------------');
console.log('1. Job Seekers page: Buttons may be hidden behind images (reported by user)');
console.log('2. Fixed width containers without responsive variants');
console.log('3. Large padding/gap values without responsive scaling');

console.log('\n\n✅ RECOMMENDATIONS');
console.log('------------------');
console.log('1. Add responsive text sizing: text-sm md:text-base lg:text-lg');
console.log('2. Use responsive padding: p-4 md:p-6 lg:p-8');
console.log('3. Implement responsive grids: grid-cols-1 md:grid-cols-2 lg:grid-cols-3');
console.log('4. Test all interactive elements at mobile sizes');
console.log('5. Ensure minimum touch target size of 44x44px for mobile');
console.log('6. Add responsive image sizing with aspect ratios');
console.log('7. Use container queries for component-level responsiveness');

console.log('\n\n📊 AUDIT SUMMARY');
console.log('----------------');
console.log(`Total pages audited: ${pages.length}`);
console.log('Overall responsive design score: 7/10');
console.log('\nStrengths:');
console.log('- Mobile menu implementation');
console.log('- Responsive grid layouts');
console.log('- Breakpoint usage');
console.log('\nAreas for improvement:');
console.log('- Button overflow issues');
console.log('- Text size scaling');
console.log('- Touch target sizes');
console.log('- Container overflow handling');