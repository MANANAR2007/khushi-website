import React from 'react';

export default function RevealText({ text }) {
  const words = text.split(' ').filter(Boolean);
  return (
    <span className="reveal-text">
      {words.map((word, index) => (
        <span key={`${word}-${index}`} className="reveal-word" style={{ '--i': index }}>
          {word}
        </span>
      ))}
    </span>
  );
}
