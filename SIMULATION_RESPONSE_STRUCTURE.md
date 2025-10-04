# Simulation Response Structure - Implementation Summary

## Overview

The simulation response has been completely refactored to provide comprehensive, user-friendly data for the frontend. The response now includes:

1. **Summary metrics** - Key pension information at a glance
2. **Chart data** - Pre-calculated data for 4 different visualizations
3. **Improvement scenarios** - 3 actionable ways to improve pension

## Response Structure

### 1. Summary (`PensionSummaryDto`)

Key metrics displayed to the user:

- `projectedPension` - Expected monthly pension amount
- `currentSalary` - Last salary used in calculation (monthly)
- `expectedPension` - Target pension (70% of last salary)
- `replacementRate` - Percentage of salary replaced by pension
- `yearsToRetirement` - Years until retirement age
- `totalCapital` - Total accumulated capital
- `retirementAge` - Age when retiring

### 2. Charts (`PensionChartsDto`)

Four chart datasets ready for visualization:

#### A. Accumulation Over Time (Line Chart)

- Shows pension growth throughout career
- Sampled data points (every 1-5 years depending on career length)
- Includes: total balance, main account, sub account, yearly salary
- Perfect for: Line chart showing growth trajectory

#### B. Account Breakdown (Pie/Donut Chart)

- Main account vs Sub account distribution
- Shows both amounts and percentages
- Perfect for: Pie or donut chart showing portfolio composition

#### C. Contribution vs Growth (Comparison Chart)

- Total contributions made vs growth from valorization
- Shows both amounts and percentages
- Perfect for: Pie chart or side-by-side bar comparison

#### D. Decade Summary (Bar Chart)

- Groups data by decade (e.g., "2020-2029")
- Shows: average yearly contribution, balance at end, total growth
- Includes age range for each decade
- Perfect for: Grouped bar chart showing decades

### 3. Improvement Scenarios (`ImprovementScenariosDto`)

Three different strategies to improve pension:

#### A. Salary Increase Scenario

- Three options: +10%, +20%, +30% salary increase
- For each option shows:
  - New monthly salary needed
  - Salary difference
  - New projected pension
  - Pension improvement amount and percentage

#### B. Work Longer Scenario

- Three options: +1, +2, +3 additional years
- For each option shows:
  - New retirement age and year
  - New projected pension
  - Pension improvement amount and percentage

#### C. Fewer Sick Days Scenario

- Options depend on current sick leave status
- If sick leave included:
  - Option 1: No sick leave (100% reduction)
  - Option 2: 50% reduction
  - Option 3: 25% reduction
- If no sick leave: Shows "Already optimal"
- For each option shows:
  - Scenario description
  - Current and new average sick days per year
  - New projected pension
  - Pension improvement amount and percentage

## Implementation Details

### New Services

1. **`PensionCalculationService`** (enhanced)
   - Now tracks total contributions vs valorization growth
   - Calculates last yearly salary
   - Returns additional metadata (currentYear, birthYear)

2. **`ImprovementScenariosService`** (new)
   - Calculates all three improvement scenarios
   - Re-runs pension calculation for each scenario option
   - Compares results to baseline pension

3. **`ResponseBuilderService`** (new)
   - Orchestrates all data transformation
   - Builds summary from calculation results
   - Builds all four chart datasets
   - Coordinates with ImprovementScenariosService
   - Handles data sampling for large datasets

### Architecture Pattern

```
Query Handler
    ↓
Fetches Request + Result from DB
    ↓
PensionCalculationService.calculatePension()
    ↓
ResponseBuilderService.buildResponse()
    ├── buildSummary()
    ├── buildCharts()
    │   ├── buildAccumulationOverTime()
    │   ├── buildAccountBreakdown()
    │   ├── buildContributionVsGrowth()
    │   └── buildDecadeSummary()
    └── ImprovementScenariosService.calculateImprovementScenarios()
        ├── calculateSalaryIncreaseScenario()
        ├── calculateWorkLongerScenario()
        └── calculateFewerSickDaysScenario()
```

### Key Design Decisions

1. **Calculate on Read**: The comprehensive response is built when querying, not when creating the simulation. This allows for flexibility if calculation logic changes.

2. **All Numbers are `number` Type**: No string conversions in the DTO. The frontend receives clean numeric data.

3. **Pre-calculated Percentages**: All percentages are calculated on the backend to ensure consistency.

4. **Data Sampling**: Long-running careers are sampled intelligently to reduce data transfer while maintaining chart quality.

5. **Robust Scenarios**: Each scenario recalculates the entire pension, not just estimates, ensuring accuracy.

## Frontend Integration

### Example Usage

```typescript
// Fetch simulation result
const result = await getSimulationResultById(id);

// Display summary
console.log(`Projected Pension: ${result.summary.projectedPension} PLN/month`);
console.log(`Replacement Rate: ${result.summary.replacementRate}%`);

// Render accumulation chart
<LineChart data={result.charts.accumulationOverTime} />

// Render account breakdown
<PieChart data={result.charts.accountBreakdown} />

// Display improvement options
result.improvementScenarios.salaryIncrease.options.map(option => (
  <div>
    Increase salary by {option.increasePercentage}% to {option.newMonthlySalary} PLN
    → Pension improves by {option.pensionImprovement} PLN ({option.improvementPercentage}%)
  </div>
));
```

## Chart Recommendations

### 1. Accumulation Over Time

- **Type**: Multi-line chart
- **X-axis**: Year or Age
- **Y-axis**: Balance (PLN)
- **Lines**: Total Balance (bold), Main Account, Sub Account
- **Optional**: Add salary line for comparison

### 2. Account Breakdown

- **Type**: Donut or Pie chart
- **Segments**: Main Account (larger), Sub Account (smaller)
- **Labels**: Show percentage and amount

### 3. Contribution vs Growth

- **Type**: Pie chart or stacked bar
- **Segments**: Your Contributions, Valorization Growth
- **Labels**: Show percentage and amount
- **Insight**: Shows how much came from your pocket vs market growth

### 4. Decade Summary

- **Type**: Grouped bar chart
- **X-axis**: Decades (with age ranges)
- **Y-axis**: Amount (PLN)
- **Bars**: Average Yearly Contribution, Total Growth
- **Insight**: Shows peak earning/saving years

## Notes

- All monetary values are in PLN
- All values are rounded to 2 decimal places
- Replacement rate assumes 70% of last salary as target
- Sick leave impact assumes ~10 days per year average
- Valorization rates and contribution rates come from historical/projected data

## Testing

To test the new structure:

```bash
# Start the API
cd apps/api
pnpm dev

# Create a simulation
POST /api/simulation/requests
{
  "age": 30,
  "sex": "male",
  "grossSalary": 8000,
  "workStartDate": "2020-01-01",
  "plannedRetirementYear": 2057,
  "includeSickLeave": true
}

# Get the comprehensive result
GET /api/simulation/results/:id
```

The response will include all summary, charts, and improvement scenarios ready for frontend display.
