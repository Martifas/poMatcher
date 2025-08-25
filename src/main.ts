import emails from '../data/emails.json' with { type: 'json' };
import pos from '../data/pos.json' with { type: 'json' };
import { matchEmailsToPOs } from './helpers/matching/matchEmailsToPOs.js';
import { resultsToCSV } from './helpers/output/resultsToCSV.js';
import fs from 'fs';

const results = matchEmailsToPOs(emails, pos);

fs.mkdirSync('output', { recursive: true });
fs.writeFileSync('output/output.csv', resultsToCSV(results));

console.log('Results written to output.csv');
