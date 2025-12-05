// Debug script to check the ranges and see what's happening

import { input as mainInput} from "./input"

function debugRanges() {
  const lines = mainInput.trim().split('\n');
  
  // Find the separator line (empty line)
  let separatorIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '') {
      separatorIndex = i;
      break;
    }
  }
  
  console.log('Found separator at line:', separatorIndex);
  console.log('Total lines:', lines.length);
  
  // Parse ranges (lines before separator)
  const ranges = [];
  for (let i = 0; i < separatorIndex; i++) {
    const line = lines[i].trim();
    if (line) {
      const [startStr, endStr] = line.split('-');
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);
      ranges.push({ start, end });
      
      // Show first few ranges for debugging
      if (i < 5) {
        console.log(`Range ${i + 1}: ${start} - ${end} (coverage: ${end - start + 1})`);
      }
      
      // Check for any invalid ranges
      if (start > end) {
        console.log(`ERROR: Invalid range at line ${i + 1}: ${start} > ${end}`);
      }
    }
  }
  
  console.log(`Total ranges parsed: ${ranges.length}`);
  
  // Show some statistics
  const coverages = ranges.map(r => r.end - r.start + 1);
  const totalCoverage = coverages.reduce((sum, c) => sum + c, 0);
  console.log(`Total individual coverage (without merging): ${totalCoverage}`);
  console.log(`Average range coverage: ${totalCoverage / ranges.length}`);
  console.log(`Min coverage: ${Math.min(...coverages)}`);
  console.log(`Max coverage: ${Math.max(...coverages)}`);
  
  // Now sort and merge
  ranges.sort((a, b) => a.start - b.start);
  
  console.log('\nFirst 10 ranges after sorting:');
  for (let i = 0; i < Math.min(10, ranges.length); i++) {
    console.log(`${ranges[i].start} - ${ranges[i].end}`);
  }
  
  // Merge overlapping ranges
  const mergedRanges = [];
  let currentRange = { ...ranges[0] };
  
  for (let i = 1; i < ranges.length; i++) {
    const range = ranges[i];
    
    // If ranges overlap or are adjacent, merge them
    if (range.start <= currentRange.end + 1) {
      currentRange.end = Math.max(currentRange.end, range.end);
    } else {
      // No overlap, push current range and start new one
      mergedRanges.push(currentRange);
      currentRange = { ...range };
    }
  }
  
  // Push the last range
  mergedRanges.push(currentRange);
  
  console.log(`\nMerged ranges: ${mergedRanges.length}`);
  console.log('First 10 merged ranges:');
  for (let i = 0; i < Math.min(10, mergedRanges.length); i++) {
    const range = mergedRanges[i];
    console.log(`${range.start} - ${range.end} (coverage: ${range.end - range.start + 1})`);
  }
  
  // Calculate total coverage
  let totalMergedCoverage = 0;
  for (const range of mergedRanges) {
    totalMergedCoverage += (range.end - range.start + 1);
  }
  
  console.log(`\nFinal total merged coverage: ${totalMergedCoverage}`);
  
  return totalMergedCoverage;
}

debugRanges();