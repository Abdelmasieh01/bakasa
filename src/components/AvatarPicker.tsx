import { useState } from 'react';
import { AVATAR_ICONS, AVATAR_COLORS } from '../utils/avatars';
import './AvatarPicker.css';

interface AvatarPickerProps {
  currentIcon: string;
  currentColor: string;
  onSave: (icon: string, color: string) => void;
  onClose: () => void;
}

export default function AvatarPicker({
  currentIcon,
  currentColor,
  onSave,
  onClose,
}: AvatarPickerProps) {
  const [icon, setIcon] = useState(currentIcon);
  const [color, setColor] = useState(currentColor);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="avatar-picker" onClick={(e) => e.stopPropagation()}>
        <h3 className="picker-title">Choose Avatar</h3>

        {/* Preview */}
        <div className="avatar-preview" style={{ background: color }}>
          <span>{icon}</span>
        </div>

        {/* Icon Grid */}
        <p className="picker-label">Icon</p>
        <div className="icon-grid">
          {AVATAR_ICONS.map((ic) => (
            <button
              key={ic}
              className={`icon-cell ${ic === icon ? 'selected' : ''}`}
              onClick={() => setIcon(ic)}
            >
              {ic}
            </button>
          ))}
        </div>

        {/* Color Grid */}
        <p className="picker-label">Color</p>
        <div className="color-grid">
          {AVATAR_COLORS.map((col) => (
            <button
              key={col}
              className={`color-swatch ${col === color ? 'selected' : ''}`}
              style={{ background: col }}
              onClick={() => setColor(col)}
            />
          ))}
          {/* Custom color */}
          <label className="color-custom" title="Custom color">
            🎨
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </label>
        </div>

        <div className="picker-actions">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-save" onClick={() => onSave(icon, color)}>Save</button>
        </div>
      </div>
    </div>
  );
}
