# ZUS Data Files

## data.json

This file contains **real ZUS (Polish Social Insurance Institution) data** with yearly parameters for pension calculations from 2014 to 2100.

### Data Structure

Each entry contains:

- `rok` - Year (2014-2100)
- `wskaznikWzrostuWynagrodzenia` - Wage growth index
- `przecietneWynagrodzenie` - Average national wage (PLN)
- `stopaNaSubkonto` - Sub-account contribution rate (4.38%)
- `waloryzacjaKonta` - Main account valorization rate
- `waloryzacjaSubkonta` - Sub-account valorization rate

### How It Works

The data is imported directly into TypeScript using:

```typescript
import yearlyParametersData from "../data/data.json";
```

The raw Polish field names are then mapped to English property names for consistency in the codebase.

---

## sdtz_prognoza.json

This file contains **life expectancy projections** (SDTŻ - Średnie Dalsze Trwanie Życia) from ZUS.

### Data Structure

Each entry represents a specific age:

- `wiek` - Age (0-100+)
- `"2014"`, `"2015"`, ... `"2100"` - Life expectancy in **months** for that age in each year

### Example

```json
{
  "2014": 922.7,
  "2015": 921.2,
  "2016": 925.6,
  ...
  "2100": 1043.2,
  "wiek": 1
}
```

This means a 1-year-old person in 2014 has an average life expectancy of 922.7 months (~77 years).

### How It's Used

The `getLifeExpectancy()` method:

1. Finds the data entry for the person's retirement age
2. Looks up the life expectancy for the retirement year
3. Returns the value in months for calculating the monthly pension

**Note:** This data is gender-neutral (combined statistics for both males and females).

---

## Production Deployment

### ✅ Yes, this approach works in production!

Here's why:

1. **Static Data**: The JSON file is treated as a static asset by TypeScript/JavaScript
2. **Bundled at Build Time**: During `pnpm build`, the JSON data is compiled into the JavaScript bundle
3. **No Runtime Dependencies**: The data becomes part of your application code - no need to read from filesystem
4. **Fast Access**: Data is loaded into memory when the application starts
5. **Docker/Railway Compatible**: Works seamlessly in containerized environments

### Build Process

When you run `pnpm --filter=api build`:

1. TypeScript compiler processes the JSON import
2. Data is transformed into JavaScript constants
3. Output is placed in `dist/` directory
4. The JSON data becomes part of your compiled code

### Deployment to Railway

Your `Dockerfile` and Railway deployment will work without any modifications because:

- The JSON file is in the `src/` directory
- It gets compiled during the build step
- The final Docker image contains the processed data
- No need for volume mounts or external data files

### Memory Impact

- **Data Size**: ~698 lines ≈ 20-30 KB
- **Memory Usage**: Negligible (< 1 MB in memory)
- **Performance**: Instant lookups using array methods

### If You Need to Update Data

To update the pension calculation parameters:

1. **Replace the JSON file**: Edit `data.json` with new ZUS data
2. **Rebuild**: Run `pnpm --filter=api build`
3. **Redeploy**: Push to git, Railway will automatically redeploy

**Note**: Changing this data requires a new deployment. For frequently changing data, consider using a database or external API instead.

## Alternative Approaches

If you need more flexibility, here are alternatives:

### Database Approach

```typescript
// Store yearly parameters in PostgreSQL
// Pros: Can update without redeployment
// Cons: More complex, requires migrations
```

### Environment Variable Approach

```typescript
// For small config changes
// Pros: Easy to update per environment
// Cons: Not suitable for large datasets
```

### External API Approach

```typescript
// Fetch from ZUS API or your own service
// Pros: Always up-to-date, no redeployment
// Cons: Network dependency, latency
```

## Conclusion

**The current JSON file approach is perfect for:**

- ✅ Historical data that rarely changes
- ✅ Hackathon/MVP projects
- ✅ Fast, reliable lookups
- ✅ Simple deployment process

**Consider alternatives if:**

- ❌ Data changes frequently (weekly/daily)
- ❌ Different data per user/tenant
- ❌ Data size exceeds several MB
- ❌ Need real-time updates without redeployment
