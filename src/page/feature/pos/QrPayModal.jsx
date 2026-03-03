/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { createKhqrPayload } from "../../../utils/khqrApi";

const money = (n) => (Number.isFinite(n) ? n.toFixed(2) : "0.00");

export default function QrPayModal({ open, onClose, amount, orderNo }) {
  const [payload, setPayload] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    setLoading(true);
    setPayload("");

    createKhqrPayload({ amount, orderNo })
      .then(setPayload)
      .catch((e) => setPayload(`ERROR: ${e.message}`))
      .finally(() => setLoading(false));
  }, [open, amount, orderNo]);

  if (!open) return null;

  return (
    <div className="qr-modal-backdrop" onMouseDown={onClose}>
      <div className="qr-modal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="qr-modal-head">
          <div>
            <h3>Scan to Pay (KHQR)</h3>
            <p>Order {orderNo} • Total ${money(Number(amount || 0))}</p>
          </div>
          <button type="button" className="qr-x" onClick={onClose}>×</button>
        </div>

        <div className="qr-modal-body">
          {loading ? (
            <p>Generating QR...</p>
          ) : payload.startsWith("ERROR:") ? (
            <p style={{ color: "red" }}>{payload}</p>
          ) : (
            <>
              <QRCodeCanvas value={payload} size={240} level="M" includeMargin />
              <p className="qr-hint">Scan with ABA / ACLEDA / Wing / Bakong</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}