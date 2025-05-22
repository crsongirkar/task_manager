import { con } from '../utils/db.mjs';

export const logAudit = (
  action: string,
  tableName: string,
  recordId: number,
  username: string,
  description: string
) => {
  const sql = `INSERT INTO audit_logs (action, table_name, record_id, username, description) VALUES (?, ?, ?, ?, ?)`;
  const values = [action, tableName, recordId, username, description];

  con.query(sql, values, (err) => {
    if (err) {
      console.error("Audit log failed:", err.message);
    } else {
      console.log("✅ Audit log recorded.");
    }
  });
};
