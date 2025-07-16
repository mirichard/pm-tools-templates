import { screen, fireEvent } from '@testing-library/react';

export interface CommandState {
  selectedIndex: number;
  query: string;
  visibleCommands: string[];
}

export const commandPaletteUtils = {
  getCommandState: (): CommandState => {
    const commands = screen.queryAllByRole('option')
      .filter(option => !option.getAttribute('role')?.includes('presentation'))
      .map(option => {
        const label = option.querySelector('.command-label');
        return label?.textContent?.trim() || '';
      });
    const selectedCommand = screen.queryAllByRole('option').find(option => 
      option.getAttribute('aria-selected') === 'true'
    );
    const selectedIndex = selectedCommand 
      ? screen.queryAllByRole('option').indexOf(selectedCommand)
      : -1;
    const searchInput = screen.getByRole('textbox');
    const query = searchInput.getAttribute('value') || '';

    return {
      selectedIndex,
      query,
      visibleCommands: commands
    };
  },

  navigateCommands: (direction: 'up' | 'down', times: number = 1) => {
    const input = screen.getByRole('textbox');
    const key = direction === 'up' ? 'ArrowUp' : 'ArrowDown';
    
    Array.from({ length: times }).forEach(() => {
      fireEvent.keyDown(input, { key });
    });

    return commandPaletteUtils.getCommandState();
  },

  searchCommand: (searchText: string) => {
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: searchText } });
    
    return commandPaletteUtils.getCommandState();
  },

  selectCommand: (commandIndex: number) => {
    const commands = screen.queryAllByRole('option');
    if (commandIndex >= 0 && commandIndex < commands.length) {
      fireEvent.click(commands[commandIndex]);
    }
    return commandPaletteUtils.getCommandState();
  },

  getSelectedCommand: () => {
    const commands = screen.queryAllByRole('option')
      .filter(option => !option.getAttribute('role')?.includes('presentation'));
    return commands.find(option => 
      option.getAttribute('aria-selected') === 'true'
    );
  },

  expectCommandSelected: (commandName: string) => {
    const selectedCommand = commandPaletteUtils.getSelectedCommand();
    expect(selectedCommand).toBeTruthy();
    const label = selectedCommand?.querySelector('.command-label');
    expect(label?.textContent?.trim()).toContain(commandName);
    expect(selectedCommand).toHaveClass('command-item', 'selected');
  }
};
