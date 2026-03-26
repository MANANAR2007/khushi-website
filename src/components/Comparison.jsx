import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { comparison } from '../data.js';

export default function Comparison() {
  return (
    <section className="section-block section-contrast">
      <div className="site-shell">
        <div className="section-intro">
          <p className="eyebrow">Why Leading Brands Choose Us</p>
          <h2>Performance that protects product quality and brand reputation.</h2>
        </div>

        <div className="comparison-table-wrap">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Parameter</th>
                <th>Khushi Containers</th>
                <th>Typical Alternatives</th>
              </tr>
            </thead>
            <tbody>
              {comparison.map((row) => (
                <tr key={row.feature}>
                  <td>{row.feature}</td>
                  <td>
                    <span className="table-good"><CheckCircle2 size={16} /> {row.us}</span>
                  </td>
                  <td>
                    <span className="table-weak"><XCircle size={16} /> {row.them}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
