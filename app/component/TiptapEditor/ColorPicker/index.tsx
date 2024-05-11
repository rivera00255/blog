import { Editor } from '@tiptap/react';
import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';

const ColorPicker = ({ editor }: { editor: Editor | null }) => {
  const [color, setColor] = useState('#000');

  return (
    <HexColorPicker
      color={color}
      onChange={(color) => {
        setColor(color);
        editor && editor.chain().focus().setColor(color).run();
      }}
      onClick={(e) => e.stopPropagation()}
    />
  );
};

export default ColorPicker;
