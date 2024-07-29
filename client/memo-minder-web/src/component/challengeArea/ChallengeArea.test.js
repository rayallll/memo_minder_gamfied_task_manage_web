import React from 'react';
import { render, fireEvent, act, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ChallengeArea from './ChallengeArea'; // 根据实际路径调整

describe('ChallengeArea Component', () => {
  beforeEach(() => {
    Storage.prototype.getItem = jest.fn((key) => {
      if (key === 'boughtItems') return JSON.stringify({ sword: true, stick: true, magicBook: true });
      if (key === 'challengeAttempts') return JSON.stringify({ wolf: { count: 1, date: new Date().toDateString() }, cat: { count: 1, date: new Date().toDateString() }});
      return null;
    });
    Storage.prototype.setItem = jest.fn();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('character moves and attacks correctly', () => {
    const { getByTestId } = render(<ChallengeArea level={5} WolfCoinReward={() => {}} CatCoinReward={() => {}} />);
    
    // Mock user moving the character right and attacking
    fireEvent.keyDown(window, { key: 'd' });
    fireEvent.keyDown(window, { key: '9' }); // Assume '9' triggers a sword attack

    // Advance timers for any animations or async effects
    jest.advanceTimersByTime(500);

    // Assertions to check if the character moved and attacked
    // This will depend on how your component updates the character's position and image
    expect(getByTestId('character')).toHaveStyle(`background-image: url(rightSword1.png)`); // This assumes you have a way to test the character's current image or animation state
    // You would need to adjust the assertion to match your implementation

    // Check if the boss's health decreased
    expect(getByTestId('boss-health').textContent).not.toBe('100%'); // Assuming the boss starts with 100% health
  });

  test('magic attack decreases boss health if in range', () => {
    const { getByText } = render(<ChallengeArea level={10} WolfCoinReward={() => {}} CatCoinReward={() => {}} />);
    
    // Enable magic attack
    fireEvent.keyDown(window, { key: '0' });
    fireEvent.click(window); // Simulate clicking to perform a magic attack

    // Advance timers for the magic attack animation
    jest.advanceTimersByTime(1000);

    // Check if the boss's health decreased after the magic attack
    expect(getByText('Boss Health')).toBeInTheDocument(); // You would need to adjust this based on how boss health is displayed in your component
    // The exact assertion might depend on your implementation details
  });

  test('game starts and boss is defeated', () => {
    const wolfCoinRewardMock = jest.fn();
    const { getByText } = render(<ChallengeArea level={6} WolfCoinReward={wolfCoinRewardMock} CatCoinReward={() => {}} />);

    // Start the game
    fireEvent.click(getByText('START'));

    // Simulate defeating the boss
    fireEvent.keyDown(window, { key: '9' }); // Assuming '9' is a powerful attack
    jest.advanceTimersByTime(500); // Simulate time for the attack to take effect

    // Verify that the reward function was called
    expect(wolfCoinRewardMock).toHaveBeenCalled();

    // Verify that a victory message is displayed
    expect(getByText(/victory/i)).toBeInTheDocument(); // Adjust based on how victory is indicated in your component
  });

  test('player health decreases when attacked by boss', () => {
    const { getByTestId } = render(<ChallengeArea level={5} WolfCoinReward={() => {}} CatCoinReward={() => {}} />);

    // Simulate boss attack
    fireEvent.bossAttack(); // You'll need to simulate this based on your component logic

    // Check if player's health decreased
    expect(getByTestId('player-health').textContent).not.toBe('100%');
  });

  test('renders with initial state correctly', () => {
    const { getByText } = render(<ChallengeArea level={1} WolfCoinReward={() => {}} CatCoinReward={() => {}} />);
    expect(getByText('Challenge Area')).toBeInTheDocument();
    expect(getByText('LEVEL 5  WOLF')).toBeInTheDocument();
    expect(getByText('LEVEL 10  CAT')).toBeInTheDocument();
  });

  test('character movement to the right', () => {
    const { getByText } = render(<ChallengeArea level={5} WolfCoinReward={() => {}} CatCoinReward={() => {}} />);
    fireEvent.keyDown(window, { key: 'd' });
    // Assuming you have a way to display or check the character's position, replace 'character position' with that
    // For example, you might check the style of the character element to ensure it moved right
    // This is a placeholder test to give you an idea of what to look for
    expect(getByText('Move Right D/->')).toBeInTheDocument(); // Adjust this to match how you can verify movement
  });

  test('sword attack triggers animation and decreases boss health', () => {
    const { getByTestId, getByText } = render(<ChallengeArea level={6} WolfCoinReward={() => {}} CatCoinReward={() => {}} />);
    fireEvent.keyDown(window, { key: '9' });
    // Verify that the sword attack animation is displayed
    // This will depend on how you're handling animations; you might check the character's current image or a class name indicating the attack state
    // Verify boss health decreases if in range (you'll need to mock or set the initial state for the boss's position and health to test this effectively)
    expect(getByText('Sword Attack 9')).toBeInTheDocument(); // This is a placeholder, adjust as needed
  });

  test('magic attack toggles on key press', () => {
    const { getByText } = render(<ChallengeArea level={10} WolfCoinReward={() => {}} CatCoinReward={() => {}} />);
    fireEvent.keyDown(window, { key: '0' }); // Toggle magic attack
    // Check for some indication that magic attack mode is enabled. This could be a class name, text content update, or the presence of a specific element.
    // For example, you might check if the "Use Magic State 0" text or an equivalent visual indicator is present
    expect(getByText('Open Magic State0Magic AttackMouse Click')).toBeInTheDocument(); // Adjust according to your UI
  });

test('character movement to the left', () => {
    const { getByText } = render(<ChallengeArea level={5} WolfCoinReward={() => {}} CatCoinReward={() => {}} />);
    fireEvent.keyDown(window, { key: 'a' });
    // Similar to moving right, verify the character moves left. This might involve checking the character's position or a related visual indication.
    expect(getByText('Move Left A/<-')).toBeInTheDocument(); // Adjust verification method as needed
  });
  
  test('normal attack triggers animation and potential boss health decrease', () => {
    const { getByText } = render(<ChallengeArea level={5} WolfCoinReward={() => {}} CatCoinReward={() => {}} />);
    fireEvent.keyDown(window, { key: '7' });
    // Verify the normal attack animation and check if the boss's health decreases when in range. The exact assertion might vary based on your component's structure.
    expect(getByText('Normal Attack 7')).toBeInTheDocument(); // Placeholder, adjust accordingly
  });
  
  test('stick attack when the item is bought', () => {
    // Ensure the localStorage mock includes a stick item to simulate it being bought
    Storage.prototype.getItem = jest.fn(() => JSON.stringify({ stick: true }));
    
    const { getByText } = render(<ChallengeArea level={5} WolfCoinReward={() => {}} CatCoinReward={() => {}} />);
    fireEvent.keyDown(window, { key: '8' });
    // Verify the stick attack animation. You would need to check for specific class names, images, or other indicators that the attack is in progress.
    expect(getByText('Stick Attack 8')).toBeInTheDocument(); // This is a placeholder. Adapt as needed based on your UI logic.
  });
  test('magic attack functionality and boss health impact', () => {
    const { getByText, getByTestId } = render(<ChallengeArea level={10} WolfCoinReward={() => {}} CatCoinReward={() => {}} />);
    
    // Enable magic attack mode
    fireEvent.keyDown(window, { key: '0' });
    // Simulate a click to perform a magic attack
    fireEvent.click(window);
    
    // Verify that the magic attack occurs. This might involve checking for a visual effect or a decrease in the boss's health.
    // As with other tests, the exact method of verification will depend on your component's implementation.
    expect(getByText('Open Magic State0Magic AttackMouse Click')).toBeInTheDocument(); // Adjust based on how you can verify a magic attack was triggered.
    // Additionally, check for a decrease in the boss's health or other effects specific to the magic attack.
  });
  
  test('boss defeat triggers victory message', async () => {
    const { getByText, findByTestId } = render(<ChallengeArea level={5} WolfCoinReward={() => {}} CatCoinReward={() => {}} />);
    
    // Mock boss health to be low enough that a single attack would defeat it
    // You might need to directly manipulate the component's state or use a specific setup if your component allows for it
    // Simulate an attack that would reduce the boss's health to 0
    fireEvent.keyDown(window, { key: '9' }); // Assuming '9' triggers an attack strong enough for this scenario
  
    // Wait for the victory message to appear
    const victoryPopup = await findByTestId('popup');
    expect(victoryPopup.textContent).toContain('Victory!'); // Adjust based on your actual victory message
  });

  test('player health decreases upon boss attack', async () => {
    // Assuming your component allows you to set or mock the initial player health
    const initialHealth = 100; // Example initial health
    
    const { getByText } = render(<ChallengeArea level={5} WolfCoinReward={() => {}} CatCoinReward={() => {}} />);
    
    // Mock a boss attack happening. This could be triggered in various ways, depending on how boss attacks are implemented.
    // For example, if boss attacks are time-based, you might need to advance timers using jest.advanceTimersByTime(ms).
    // Simulate the conditions for a boss attack, potentially by advancing time or triggering the attack directly if your implementation allows
    jest.advanceTimersByTime(1000); // Example: advance time to trigger a boss attack
  
    // Verify the player's health has decreased from the initial health
    const healthBar = getByText(`${initialHealth}/100`); // Adjust this selector based on how you're displaying health
    expect(healthBar.textContent).not.toBe(`${initialHealth}/100`); // This checks that the displayed health is not the initial value
  });
  
  test('popup closes on click', async () => {
    const { findByTestId } = render(<ChallengeArea level={5} WolfCoinReward={() => {}} CatCoinReward={() => {}} />);
    // Assuming an action that opens the popup
    fireEvent.keyDown(window, { key: '0' }); // Example action that might open a popup
    const popup = await findByTestId('popup');
    fireEvent.click(popup);
    expect(popup).not.toBeInTheDocument();
  });

  test('rewards assigned correctly upon boss defeat', () => {
    const wolfCoinRewardMock = jest.fn();
    const catCoinRewardMock = jest.fn();
  
    // Render component with mocked reward functions
    render(<ChallengeArea level={10} WolfCoinReward={wolfCoinRewardMock} CatCoinReward={catCoinRewardMock} />);
  
    // Trigger boss defeat scenario
    // This might involve setting boss health low and triggering an attack, similar to the boss defeat test
    fireEvent.keyDown(window, { key: '9' }); // Simulate defeating the boss
  
    // Check that the correct reward function was called
    expect(wolfCoinRewardMock).not.toHaveBeenCalled(); // Assuming the boss is a cat
    expect(catCoinRewardMock).toHaveBeenCalled();
  });

  test('challenge attempts decrement and disable start button', () => {
    const { getByText, rerender } = render(<ChallengeArea level={10} WolfCoinReward={() => {}} CatCoinReward={() => {}} />);
  
    // Initially, the challenge should be available
    fireEvent.click(getByText('START'));
    // Re-render with potentially updated props or to simulate state change
    rerender(<ChallengeArea level={10} WolfCoinReward={() => {}} CatCoinReward={() => {}} />);
    // Expect the start button to be disabled after using an attempt
    expect(getByText('START').disabled).toBeTruthy();
  });

  test('bosses unlock based on level', () => {
    const { queryByText, rerender } = render(<ChallengeArea level={4} WolfCoinReward={() => {}} CatCoinReward={() => {}} />);
    // Level 4 should not unlock any bosses
    expect(queryByText('LEVEL 5  WOLF')).toBeInTheDocument();
    expect(queryByText('LEVEL 10  CAT')).not.toBeInTheDocument();
  
    // Rerender with a higher level to test conditional rendering
    rerender(<ChallengeArea level={10} WolfCoinReward={() => {}} CatCoinReward={() => {}} />);
    // Now both bosses should be available
    expect(queryByText('LEVEL 5  WOLF')).toBeInTheDocument();
    expect(queryByText('LEVEL 10  CAT')).toBeInTheDocument();
  });

  test('local storage updates challenge attempts', () => {
    // Simulate setting an item in localStorage
    Storage.prototype.getItem = jest.fn(() => JSON.stringify({ wolf: { count: 1, date: new Date().toDateString() } }));
    Storage.prototype.setItem = jest.fn();
  
    render(<ChallengeArea level={5} WolfCoinReward={() => {}} CatCoinReward={() => {}} />);
    // Trigger functionality that should update localStorage
    fireEvent.keyDown(window, { key: 'd' }); // This is just an example; adjust based on actual functionality
    expect(Storage.prototype.setItem).toHaveBeenCalledWith('challengeAttempts', expect.any(String));
  });

  test('magic attack animation and position logic', async () => {
    const { getByTestId } = render(<ChallengeArea level={10} WolfCoinReward={() => {}} CatCoinReward={() => {}} />);
    // Assume magic attack is triggered and a magic attack icon appears
    fireEvent.keyDown(window, { key: '0' }); // 开启魔法攻击状态
    fireEvent.click(window); // Assume this click is at the correct position for a magic attack
  
    // You might need to mock or simulate the correct positioning for the attack
    // Check if the boss health decreases based on the attack
    // This might involve waiting for animations to finish or directly checking the state if accessible
    expect(getByTestId('boss-health').textContent).not.toBe('100/100'); // Adjust based on your actual implementation
  });

  test('requirement checks for using magic, sword, and stick attacks', () => {
    Storage.prototype.getItem = jest.fn(() => JSON.stringify({})); // Assume nothing is bought
    const { getByText } = render(<ChallengeArea level={10} WolfCoinReward={() => {}} CatCoinReward={() => {}} />);
  
    fireEvent.keyDown(window, { key: '9' }); // 尝试使用剑攻击
    expect(getByText('Purchase Required')).toBeInTheDocument();
  
    fireEvent.keyDown(window, { key: '8' }); // 尝试使用棍子攻击
    expect(getByText('Purchase Required')).toBeInTheDocument();
  
    fireEvent.keyDown(window, { key: '0' }); // 尝试开启魔法攻击
    expect(getByText('Purchase Required')).toBeInTheDocument();
  });

  test('challenge attempts reset logic', () => {
    jest.useFakeTimers();
    render(<ChallengeArea level={10} WolfCoinReward={() => {}} CatCoinReward={() => {}} />);
  
    // Simulate the passing of time to the next reset point
    jest.advanceTimersByTime(/* Amount of time until the reset occurs */);
  
    // Check if the attempts have been reset
    // This could involve checking localStorage or the state of the component
    expect(localStorage.getItem('challengeAttempts')).toBe(/* Expected reset state */);
  });

  test('game start and end logic', () => {
    const { getByText, queryByText } = render(<ChallengeArea level={10} WolfCoinReward={() => {}} CatCoinReward={() => {}} />);
    fireEvent.click(getByText('START')); // Start the game
  
    // Check if the game has started correctly
    expect(queryByText('Challenge Area')).not.toBeInTheDocument(); // Assuming the start screen is replaced
  
    // Simulate conditions for game end (e.g., boss defeated or player health reaches 0)
    // Check if the appropriate end game message is shown
    expect(queryByText('Victory!')).toBeInTheDocument(); // Or 'Defeat', depending on the test case
  });

  test('player and boss health update on attack', () => {
    const { getByTestId, getByText } = render(<ChallengeArea level={10} WolfCoinReward={() => {}} CatCoinReward={() => {}} />);
    // Assume initial health is 100 for both player and boss
  
    fireEvent.keyDown(window, { key: '9' }); // Player attacks the boss
    // Check if boss health decreases
    expect(getByTestId('boss-health').textContent).not.toBe('100/100');
  
    // Simulate boss attacking player
    // Check if player health decreases
    expect(getByTestId('player-health').textContent).not.toBe('100/100');
  });
  
  test('magic attack triggered at correct mouse position', () => {
    const { getByText } = render(<ChallengeArea level={10} WolfCoinReward={() => {}} CatCoinReward={() => {}} />);
    fireEvent.keyDown(window, { key: '0' }); 
    fireEvent.click(document, { clientX: 100, clientY: 100 });
  });
  
  test('component correctly reads and writes to localStorage', () => {
    Storage.prototype.getItem = jest.fn().mockImplementation((key) => {
      if (key === 'boughtItems') return JSON.stringify({ sword: true, stick: true });
      if (key === 'challengeAttempts') return JSON.stringify({ wolf: { count: 1, date: new Date().toDateString() }});
    });
  
    render(<ChallengeArea level={10} WolfCoinReward={() => {}} CatCoinReward={() => {}} />);
    expect(localStorage.getItem).toHaveBeenCalledWith('boughtItems');
    expect(localStorage.getItem).toHaveBeenCalledWith('challengeAttempts');

    fireEvent.keyDown(window, { key: '9' }); 
    expect(localStorage.setItem).toHaveBeenCalled();
  });
  
  test('game logic changes after purchasing all available items', () => {
    Storage.prototype.getItem = jest.fn(() => JSON.stringify({ sword: true, stick: true, magicBook: true }));
    const { getByText } = render(<ChallengeArea level={15} WolfCoinReward={() => {}} CatCoinReward={() => {}} />);
    fireEvent.keyDown(window, { key: '9' }); 
    fireEvent.keyDown(window, { key: '8' }); 
    fireEvent.keyDown(window, { key: '0' }); 

  });
  
  test('game state changes based on player level', () => {
    let { rerender, queryByText } = render(<ChallengeArea level={4} WolfCoinReward={() => {}} CatCoinReward={() => {}} />);
    expect(queryByText('START')).toBeDisabled();
    rerender(<ChallengeArea level={5} WolfCoinReward={() => {}} CatCoinReward={() => {}} />);
    expect(queryByText('START')).not.toBeDisabled();
  });

  test('UI updates dynamically based on game progress and player interaction', () => {
    const { getByTestId, rerender } = render(<ChallengeArea level={10} WolfCoinReward={() => {}} CatCoinReward={() => {}} />);
    fireEvent.keyDown(window, { key: '9' });
    expect(getByTestId('boss-health')).toHaveTextContent('90/100'); 
  });
  
  test('unlocks new bosses based on player level', () => {
    const { rerender, getByText } = render(<ChallengeArea level={4} WolfCoinReward={() => {}} CatCoinReward={() => {}} />);
    // Level 4 should not unlock any new bosses
    expect(getByText('LEVEL 5  WOLF')).toBeDisabled();
  
    // Increase level and rerender
    rerender(<ChallengeArea level={6} WolfCoinReward={() => {}} CatCoinReward={() => {}} />);
    // Level 6 should unlock WOLF but not CAT
    expect(getByText('LEVEL 5  WOLF')).not.toBeDisabled();
    
    // Increase level to 10 and rerender
    rerender(<ChallengeArea level={10} WolfCoinReward={() => {}} CatCoinReward={() => {}} />);
    // Level 10 should unlock CAT
    expect(getByText('LEVEL 10  CAT')).not.toBeDisabled();
  });

  test('boss movement and attack simulation', () => {
    jest.useFakeTimers();
    const { getByTestId } = render(<ChallengeArea level={10} WolfCoinReward={() => {}} CatCoinReward={() => {}} />);
    const initialPlayerHealth = getByTestId('player-health').textContent;
    
    // Fast-forward time to simulate boss moving and attacking
    jest.advanceTimersByTime(5000); // Adjust time based on boss attack frequency
    
    // Assuming the boss moves closer and attacks, check player health decrease
    const updatedPlayerHealth = getByTestId('player-health').textContent;
    expect(updatedPlayerHealth).not.toBe(initialPlayerHealth);
    
    jest.useRealTimers();
  });

  test('magic book purchase allows for magic attack', () => {
    Storage.prototype.getItem = jest.fn(() => JSON.stringify({ magicBook: true }));
    
    const { getByTestId, rerender } = render(<ChallengeArea level={10} WolfCoinReward={() => {}} CatCoinReward={() => {}} />);
    
    // Simulate enabling magic attack
    fireEvent.keyDown(window, { key: '0' });
    
    // Assume magic attack is visually indicated (e.g., a class name or specific element)
    expect(getByTestId('magic-attack-indicator')).toBeInTheDocument();
    
    // Simulate attacking
    fireEvent.click(window);
    
    // Check for expected outcome, e.g., boss health decrease
    const bossHealthAfterAttack = getByTestId('boss-health').textContent;
    expect(bossHealthAfterAttack).not.toBe('100/100'); // Assuming starting health is 100
  });

  test('UI updates dynamically for health bars and popups', () => {
    const { getByTestId, findByText } = render(<ChallengeArea level={10} WolfCoinReward={() => {}} CatCoinReward={() => {}} />);
    
    // Simulate player action that would cause health change
    fireEvent.keyDown(window, { key: '9' }); // Player attacks
    
    // Check if boss health bar updated
    expect(getByTestId('boss-health').textContent).not.toBe('100/100');
    
    // Simulate conditions that would trigger a popup (e.g., boss defeated)
    // Assuming 'boss defeated' would cause a popup
    // Note: You'd need to ensure the test setup reflects a scenario where the boss can be defeated with the action taken
    const popupMessage = findByText('Victory!'); // This line assumes an async operation; adjust as needed
    expect(popupMessage).toBeInTheDocument();
  });
  
  test('bosses unlock correctly based on player level', () => {
    const { queryByText, rerender } = render(<ChallengeArea level={4} WolfCoinReward={() => {}} CatCoinReward={() => {}} />);
    
    // Test for locked state
    expect(queryByText('LEVEL 5  WOLF')).toBeDisabled();
    expect(queryByText('LEVEL 10  CAT')).toBeDisabled();
    
    // Rerender with level 5 to unlock WOLF
    rerender(<ChallengeArea level={5} WolfCoinReward={() => {}} CatCoinReward={() => {}} />);
    expect(queryByText('LEVEL 5  WOLF')).not.toBeDisabled();
    
    // Rerender with level 10 to unlock CAT
    rerender(<ChallengeArea level={10} WolfCoinReward={() => {}} CatCoinReward={() => {}} />);
    expect(queryByText('LEVEL 10  CAT')).not.toBeDisabled();
  });

  test.each([
    ['sword', '9', 'Sword Attack 9'],
    ['stick', '8', 'Stick Attack 8'],
    ['magicBook', '0', 'Open Magic State0Magic AttackMouse Click'],
  ])('attack availability based on item purchase (%s)', (item, key, expectedText) => {
    Storage.prototype.getItem = jest.fn(() => JSON.stringify({ [item]: true }));
    const { getByText } = render(<ChallengeArea level={10} WolfCoinReward={() => {}} CatCoinReward={() => {}} />);
  
    fireEvent.keyDown(window, { key });
    expect(getByText(expectedText)).toBeInTheDocument();
  });

  test('game starts and ends correctly based on player actions and boss defeat', () => {
    const { getByText, queryByText, rerender } = render(<ChallengeArea level={10} WolfCoinReward={() => {}} CatCoinReward={() => {}} />);
    
    fireEvent.click(getByText('START'));
    expect(queryByText('Challenge Area')).not.toBeInTheDocument(); // Assuming challenge area is hidden on start
    
    // Assume an action that would end the game, such as defeating the boss
    // Here, you might need to mock or directly manipulate the component state to simulate the boss being defeated
    rerender(<ChallengeArea level={10} WolfCoinReward={() => {}} CatCoinReward={() => {}} bossHealth={0} />);
    
    expect(queryByText('Victory!')).toBeInTheDocument(); // Or 'Defeat', based on the end game condition simulated
  });
  
  test('game ends correctly when player health reaches zero', () => {
    const { getByText, queryByText, rerender } = render(<ChallengeArea level={10} WolfCoinReward={() => {}} CatCoinReward={() => {}} />);
    
    fireEvent.click(getByText('START'));
    expect(queryByText('Challenge Area')).not.toBeInTheDocument(); // Assuming challenge area is hidden on start
    
    // Simulate conditions for player health reaching zero
    // You may need to mock or directly manipulate the component state to simulate player health reaching zero
    rerender(<ChallengeArea level={10} WolfCoinReward={() => {}} CatCoinReward={() => {}} playerHealth={0} />);
    
    expect(queryByText('Defeat!')).toBeInTheDocument(); // Assuming the end game message is 'Defeat!'
  });

  test('magic attack unavailable without magic book', () => {
    Storage.prototype.getItem = jest.fn(() => JSON.stringify({}));
    const { getByText } = render(<ChallengeArea level={10} WolfCoinReward={() => {}} CatCoinReward={() => {}} />);
    
    fireEvent.keyDown(window, { key: '0' }); // Try to use magic attack without magic book
    expect(getByText('Purchase Required')).toBeInTheDocument(); // Assuming 'Purchase Required' is displayed when magic attack is unavailable
  });

  test('magic attack available with magic book', () => {
    Storage.prototype.getItem = jest.fn(() => JSON.stringify({ magicBook: true }));
    const { getByText } = render(<ChallengeArea level={10} WolfCoinReward={() => {}} CatCoinReward={() => {}} />);
    
    fireEvent.keyDown(window, { key: '0' }); // Try to use magic attack with magic book
    // You need to adjust the expectation according to how the UI indicates the successful use of magic attack
    expect(getByText('Magic Attack Triggered')).toBeInTheDocument(); // Placeholder text, adjust accordingly
  });

  test('all attacks available after purchasing all items', () => {
    Storage.prototype.getItem = jest.fn(() => JSON.stringify({ sword: true, stick: true, magicBook: true }));
    const { getByText } = render(<ChallengeArea level={10} WolfCoinReward={() => {}} CatCoinReward={() => {}} />);
    
    fireEvent.keyDown(window, { key: '9' }); // Try sword attack
    fireEvent.keyDown(window, { key: '8' }); // Try stick attack
    fireEvent.keyDown(window, { key: '0' }); // Try magic attack
    
    // You need to adjust the expectation according to how the UI indicates the successful use of each attack
    expect(getByText('Sword Attack Triggered')).toBeInTheDocument(); // Placeholder text, adjust accordingly
    expect(getByText('Stick Attack Triggered')).toBeInTheDocument(); // Placeholder text, adjust accordingly
    expect(getByText('Magic Attack Triggered')).toBeInTheDocument(); // Placeholder text, adjust accordingly
  });

  test('sword attack available after purchasing sword', () => {
    Storage.prototype.getItem = jest.fn(() => JSON.stringify({ sword: true }));
    const { getByText } = render(<ChallengeArea level={10} WolfCoinReward={() => {}} CatCoinReward={() => {}} />);
    
    fireEvent.keyDown(window, { key: '9' }); // Try sword attack
    // You need to adjust the expectation according to how the UI indicates the successful use of sword attack
    expect(getByText('Sword Attack Triggered')).toBeInTheDocument(); // Placeholder text, adjust accordingly
  });
  
  test('sword consumed after using sword attack', () => {
    Storage.prototype.getItem = jest.fn(() => JSON.stringify({ sword: true }));
    const { getByText } = render(<ChallengeArea level={10} WolfCoinReward={() => {}} CatCoinReward={() => {}} />);
    
    fireEvent.keyDown(window, { key: '9' }); // Try sword attack
    // Assuming 'Sword' is no longer available after using sword attack
    expect(getByText('Sword')).not.toBeInTheDocument(); // Adjust this based on your UI logic
  });

  test('stick attack available after purchasing stick', () => {
    Storage.prototype.getItem = jest.fn(() => JSON.stringify({ stick: true }));
    const { getByText } = render(<ChallengeArea level={10} WolfCoinReward={() => {}} CatCoinReward={() => {}} />);
    
    fireEvent.keyDown(window, { key: '8' }); // Try stick attack
    // You need to adjust the expectation according to how the UI indicates the successful use of stick attack
    expect(getByText('Stick Attack Triggered')).toBeInTheDocument(); // Placeholder text, adjust accordingly
  });
  
  test('stick consumed after using stick attack', () => {
    Storage.prototype.getItem = jest.fn(() => JSON.stringify({ stick: true }));
    const { getByText } = render(<ChallengeArea level={10} WolfCoinReward={() => {}} CatCoinReward={() => {}} />);
    
    fireEvent.keyDown(window, { key: '8' }); // Try stick attack
    // Assuming 'Stick' is no longer available after using stick attack
    expect(getByText('Stick')).not.toBeInTheDocument(); // Adjust this based on your UI logic
  });

  test('magic attack available after purchasing magic book', () => {
    Storage.prototype.getItem = jest.fn(() => JSON.stringify({ magicBook: true }));
    const { getByText } = render(<ChallengeArea level={10} WolfCoinReward={() => {}} CatCoinReward={() => {}} />);
    
    fireEvent.keyDown(window, { key: '0' }); // Try magic attack
    // You need to adjust the expectation according to how the UI indicates the successful use of magic attack
    expect(getByText('Magic Attack Triggered')).toBeInTheDocument(); // Placeholder text, adjust accordingly
  });
  
  test('magic book consumed after using magic attack', () => {
    Storage.prototype.getItem = jest.fn(() => JSON.stringify({ magicBook: true }));
    const { getByText } = render(<ChallengeArea level={10} WolfCoinReward={() => {}} CatCoinReward={() => {}} />);
    
    fireEvent.keyDown(window, { key: '0' }); // Try magic attack
    // Assuming 'Magic Book' is no longer available after using magic attack
    expect(getByText('Magic Book')).not.toBeInTheDocument(); // Adjust this based on your UI logic
  });

  test('magic attack option unlocks after purchasing magic book', () => {
    Storage.prototype.getItem = jest.fn(() => JSON.stringify({ magicBook: true }));
    const { getByText } = render(<ChallengeArea level={10} WolfCoinReward={() => {}} CatCoinReward={() => {}} />);
    
    // Assuming magic attack option is initially locked
    expect(getByText('Magic Attack')).toBeDisabled(); // Adjust based on your UI logic
    
    // Trigger purchase of magic book
    fireEvent.keyDown(window, { key: 'M' }); // Example key to purchase magic book
    
    // Expect magic attack option to be unlocked after purchasing magic book
    expect(getByText('Magic Attack')).not.toBeDisabled(); // Adjust based on your UI logic
  });

  test('sword attack option unlocks after purchasing sword', () => {
    Storage.prototype.getItem = jest.fn(() => JSON.stringify({ sword: true }));
    const { getByText } = render(<ChallengeArea level={10} WolfCoinReward={() => {}} CatCoinReward={() => {}} />);
    
    // Assuming sword attack option is initially locked
    expect(getByText('Sword Attack')).toBeDisabled(); // Adjust based on your UI logic
    
    // Trigger purchase of sword
    fireEvent.keyDown(window, { key: 'S' }); // Example key to purchase sword
    
    // Expect sword attack option to be unlocked after purchasing sword
    expect(getByText('Sword Attack')).not.toBeDisabled(); // Adjust based on your UI logic
  });

  test('sword attack option remains locked if sword is not purchased', () => {
    Storage.prototype.getItem = jest.fn(() => JSON.stringify({}));
    const { getByText } = render(<ChallengeArea level={10} WolfCoinReward={() => {}} CatCoinReward={() => {}} />);
    
    // Assuming sword attack option is initially locked
    expect(getByText('Sword Attack')).toBeDisabled(); // Adjust based on your UI logic
    
    // Expect sword attack option to remain locked if sword is not purchased
    expect(getByText('Sword Attack')).toBeDisabled(); // Adjust based on your UI logic
  });
  
  test('player health decreases when attacked by boss', () => {
    const initialHealth = 100; // Example initial health
    const { getByTestId } = render(<ChallengeArea level={10} WolfCoinReward={() => {}} CatCoinReward={() => {}} />);
    
    // Assuming the boss attacks the player
    fireEvent.bossAttack(); // Example event to simulate boss attacking player
    
    // Verify the player's health has decreased from the initial health
    const updatedHealth = getByTestId('player-health').textContent;
    expect(updatedHealth).not.toBe(`${initialHealth}/100`); // Adjust this assertion based on your UI logic
  });

  test('player health increases when healed', () => {
    const initialHealth = 50; // Example initial health
    const { getByTestId } = render(<ChallengeArea level={10} WolfCoinReward={() => {}} CatCoinReward={() => {}} />);
    
    // Assuming the player receives healing
    fireEvent.healPlayer(); // Example event to simulate healing player
    
    // Verify the player's health has increased from the initial health
    const updatedHealth = getByTestId('player-health').textContent;
    expect(updatedHealth).toBeGreaterThan(`${initialHealth}/100`); // Adjust this assertion based on your UI logic
  });

  test('game state updates correctly after player actions', () => {
    const { getByTestId, getByText } = render(<ChallengeArea level={10} WolfCoinReward={() => {}} CatCoinReward={() => {}} />);
    
    // Assuming player attacks the boss
    fireEvent.attackBoss(); // Example event to simulate player attacking boss
    
    // Verify if boss health decreases
    const bossHealth = getByTestId('boss-health').textContent;
    expect(bossHealth).not.toBe('100/100'); // Adjust this assertion based on your UI logic
    
    // Assuming player uses magic attack
    fireEvent.useMagicAttack(); // Example event to simulate player using magic attack
    
    // Verify if magic attack is performed and boss health decreases
    const magicAttack = getByText('Magic Attack');
    expect(magicAttack).toBeVisible(); // Adjust this assertion based on your UI logic
    expect(bossHealth).not.toBe('100/100'); // Adjust this assertion based on your UI logic
  });

  test('game state updates correctly at game end', () => {
    const { getByText, queryByText, rerender } = render(<ChallengeArea level={10} WolfCoinReward={() => {}} CatCoinReward={() => {}} />);
    
    // Start the game
    fireEvent.click(getByText('START'));
    
    // Assume conditions for game end (e.g., player health reaches 0 or boss defeated)
    rerender(<ChallengeArea level={10} WolfCoinReward={() => {}} CatCoinReward={() => {}} gameEnded={true} />);
    
    // Verify if the appropriate end game message is shown
    expect(queryByText('Victory!')).toBeInTheDocument(); // Or 'Defeat', based on the end game condition simulated
  });

  test('player can use purchased item after buying it', () => {
    // Assume player has purchased the stick item
    Storage.prototype.getItem = jest.fn(() => JSON.stringify({ stick: true }));
    
    const { getByText } = render(<ChallengeArea level={10} WolfCoinReward={() => {}} CatCoinReward={() => {}} />);
    
    // Assuming player tries to use the stick item
    fireEvent.keyDown(window, { key: '8' }); // Trigger stick attack
    
    // Verify if the stick attack is performed
    expect(getByText('Stick Attack')).toBeInTheDocument(); // Adjust this assertion based on your UI logic
  });

  test('player can buy item when having enough coins', () => {
    // Assume player has enough coins to buy the stick item
    Storage.prototype.getItem = jest.fn(() => JSON.stringify({ coins: 100 })); // Example: Player has 100 coins
    
    const { getByText } = render(<ChallengeArea level={10} WolfCoinReward={() => {}} CatCoinReward={() => {}} />);
    
    // Assuming player tries to buy the stick item
    fireEvent.keyDown(window, { key: 'b' }); // Example key to buy item
    
    // Verify if the stick item is purchased
    expect(getByText('Stick Purchased')).toBeInTheDocument(); // Adjust this assertion based on your UI logic
  });

  test('shop displays correct items for purchase', () => {
    const { getByText } = render(<ChallengeArea level={10} WolfCoinReward={() => {}} CatCoinReward={() => {}} />);
    
    // Assuming player opens the shop
    fireEvent.keyDown(window, { key: 's' }); // Example key to open shop
    
    // Verify if the shop displays correct items
    expect(getByText('Sword - 50 coins')).toBeInTheDocument(); // Adjust this assertion based on your UI logic
    expect(getByText('Stick - 30 coins')).toBeInTheDocument(); // Adjust this assertion based on your UI logic
    expect(getByText('Magic Book - 100 coins')).toBeInTheDocument(); // Adjust this assertion based on your UI logic
  });

  test('game progress is saved correctly', () => {
    const { getByText } = render(<ChallengeArea level={10} WolfCoinReward={() => {}} CatCoinReward={() => {}} />);
    
    // Assuming player saves the game progress
    fireEvent.keyDown(window, { key: 'ctrl+s' }); // Example key to save game progress
    
    // Verify if the game progress is saved to local storage
    expect(localStorage.getItem('gameProgress')).not.toBeNull(); // Adjust this assertion based on your save logic
  });

  test('Character moves left when left arrow key is pressed', () => {
    const { getByTestId } = render(<ChallengeArea level={1} WolfCoinReward={() => {}} CatCoinReward={() => {}} />);
    const character = getByTestId('character');

    fireEvent.keyDown(window, { key: 'ArrowLeft' });

    expect(character.style.left).toBe('4%'); // Assuming initial position is 5%
  });

  test('Character moves right when right arrow key is pressed', () => {
    const { getByTestId } = render(<ChallengeArea level={1} WolfCoinReward={() => {}} CatCoinReward={() => {}} />);
    const character = getByTestId('character');

    fireEvent.keyDown(window, { key: 'ArrowRight' });

    expect(character.style.left).toBe('6%'); // Assuming initial position is 5%
  });

  test('Character attacks boss when attack key is pressed', () => {
    const { getByTestId } = render(<ChallengeArea level={1} WolfCoinReward={() => {}} CatCoinReward={() => {}} />);
    const character = getByTestId('character');
    const boss = getByTestId('boss');
    const bossHealthBar = getByTestId('boss-health-bar');

    fireEvent.keyDown(window, { key: '9' }); // Assuming sword attack key

    // Boss health should decrease
    expect(bossHealthBar.style.width).toBe('95%'); // Assuming initial boss health is 100%
  });

  test('Boss attacks character when in range', () => {
    const { getByTestId } = render(<ChallengeArea level={1} WolfCoinReward={() => {}} CatCoinReward={() => {}} />);
    const boss = getByTestId('boss');
    const characterHealthBar = getByTestId('combat-health-level');

    // Move character to boss position
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    fireEvent.keyDown(window, { key: 'ArrowRight' });

    // Boss attacks
    expect(characterHealthBar.style.width).toBe('95%'); // Assuming initial character health is 100%
  });

  test('Magic attack is triggered when magic key is pressed', () => {
    const { getByTestId } = render(<ChallengeArea level={1} WolfCoinReward={() => {}} CatCoinReward={() => {}} />);
    const magicButton = getByTestId('magic-button');
    const bossHealthBar = getByTestId('boss-health-bar');

    fireEvent.click(magicButton);

    // Boss health should decrease if boss is hit by magic attack
    expect(bossHealthBar.style.width).not.toBe('100%'); // Assuming initial boss health is 100%
  });

  test('Character earns reward after defeating boss', () => {
    const wolfCoinRewardMock = jest.fn();
    const { getByTestId } = render(<ChallengeArea level={1} WolfCoinReward={wolfCoinRewardMock} CatCoinReward={() => {}} />);
    const character = getByTestId('character');

    // Move character to boss position
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    fireEvent.keyDown(window, { key: 'ArrowRight' });

    // Defeat boss
    fireEvent.keyDown(window, { key: '9' }); // Assuming sword attack key

    // Ensure the reward function is called
    expect(wolfCoinRewardMock).toHaveBeenCalled();

    
  });

  test('Character takes damage when colliding with boss attack', () => {
    const { getByTestId } = render(<ChallengeArea level={1} WolfCoinReward={() => {}} CatCoinReward={() => {}} />);
    const characterHealthBar = getByTestId('character-health-bar');
    const boss = getByTestId('boss');

    // Move boss to collide with character
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    fireEvent.keyDown(window, { key: 'ArrowRight' });

    // Trigger boss attack
    fireEvent.keyDown(window, { key: '9' }); // Assuming sword attack key

    // Ensure character health decreases after collision with boss attack
    expect(characterHealthBar.style.width).not.toBe('100%'); // Assuming initial character health is 100%
  });

  test('Popup is displayed when character is defeated', () => {
    const { getByTestId, queryByText } = render(<ChallengeArea level={1} WolfCoinReward={() => {}} CatCoinReward={() => {}} />);
    const characterHealthBar = getByTestId('character-health-bar');

    // Set character health to 0
    characterHealthBar.style.width = '0%';

    // Ensure popup is displayed when character is defeated
    expect(queryByText('Defeat')).toBeInTheDocument();
  });

  test('Challenge starts when start button is clicked', () => {
    const { getByTestId } = render(<ChallengeArea level={1} WolfCoinReward={() => {}} CatCoinReward={() => {}} />);
    const startButton = getByTestId('start-button');

    // Click start button
    fireEvent.click(startButton);

    // Ensure game has started
    expect(getByTestId('combat-background')).toBeInTheDocument();
  });

});

test('Character cannot move beyond game boundaries', () => {
    const { getByTestId } = render(<ChallengeArea level={1} WolfCoinReward={() => {}} CatCoinReward={() => {}} />);
    const character = getByTestId('character');
  
    // Move character beyond left boundary
    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    expect(character.style.left).toBe('0%'); // Character should not move beyond left boundary
  
    // Move character beyond right boundary
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    fireEvent.keyDown(window, { key: 'ArrowRight' }); // Move beyond the right boundary
    expect(character.style.left).toBe('96%'); // Character should not move beyond right boundary
  });
  
  test('Invalid key presses do not affect game state', () => {
    const { getByTestId } = render(<ChallengeArea level={1} WolfCoinReward={() => {}} CatCoinReward={() => {}} />);
    const character = getByTestId('character');
    const initialCharacterPosition = character.style.left;
  
    // Press an invalid key
    fireEvent.keyDown(window, { key: 'Q' });
  
    // Character position should remain unchanged
    expect(character.style.left).toBe(initialCharacterPosition);

    test('Shop displays items and allows purchase', () => {
        const { getByTestId, getByText } = render(<ChallengeArea level={1} WolfCoinReward={() => {}} CatCoinReward={() => {}} />);
        const shopButton = getByTestId('shop-button');
      
        // Open the shop
        fireEvent.click(shopButton);
      
        // Ensure items are displayed
        expect(getByText('Sword - 50 coins')).toBeInTheDocument();
        expect(getByText('Stick - 30 coins')).toBeInTheDocument();
        expect(getByText('Magic Book - 100 coins')).toBeInTheDocument();
      
        // Purchase an item (assuming sword is bought)
        fireEvent.click(getByText('Sword - 50 coins'));
      
        // Ensure item is purchased
        expect(getByText('Sword Purchased')).toBeInTheDocument();
      });
      
      test('Game initializes correctly', () => {
        const { getByTestId } = render(<ChallengeArea level={1} WolfCoinReward={() => {}} CatCoinReward={() => {}} />);
      
        // Ensure necessary components are present
        expect(getByTestId('character')).toBeInTheDocument();
        expect(getByTestId('boss')).toBeInTheDocument();
        expect(getByTestId('combat-background')).toBeInTheDocument();
      });
      
      test('Integration: Character health decreases when attacked by boss', () => {
        const { getByTestId } = render(<ChallengeArea level={10} WolfCoinReward={() => {}} CatCoinReward={() => {}} />);
        const initialCharacterHealth = getByTestId('character-health-bar').style.width;
      
        // Simulate boss attack
        fireEvent.bossAttack();
      
        // Verify character health decreases
        const updatedCharacterHealth = getByTestId('character-health-bar').style.width;
        expect(updatedCharacterHealth).not.toBe(initialCharacterHealth);
      });
      
      // Assuming this function is part of your codebase and currently not covered by tests
    function divide(a, b) {
        if (b === 0) {
          throw new Error('Divide by zero error');
        }
        return a / b;
      }
      
      // Write a test to cover the error handling branch
      test('divide throws error when dividing by zero', () => {
        expect(() => {
          divide(10, 0);
        }).toThrow('Divide by zero error');
      });
      
      // Write additional tests to cover different branches of the divide function
      test('divide returns correct result for valid inputs', () => {
        expect(divide(10, 2)).toBe(5);
        expect(divide(0, 5)).toBe(0);
      });
      
      // Refactor existing tests to increase coverage
      test('magic attack option unlocks after purchasing magic book', () => {
        Storage.prototype.getItem = jest.fn(() => JSON.stringify({ magicBook: true }));
        const { getByText } = render(<ChallengeArea level={10} WolfCoinReward={() => {}} CatCoinReward={() => {}} />);
        
        // Assuming magic attack option is initially locked
        expect(getByText('Magic Attack')).toBeDisabled(); // Adjust based on your UI logic
        
        // Trigger purchase of magic book
        fireEvent.keyDown(window, { key: 'M' }); // Example key to purchase magic book
        
        // Expect magic attack option to be unlocked after purchasing magic book
        expect(getByText('Magic Attack')).not.toBeDisabled(); // Adjust based on your UI logic
      
        // Ensure the correct item is stored in localStorage after purchase
        expect(localStorage.setItem).toHaveBeenCalledWith('magicBook', true);
      });
      
      // Assuming this function is part of your codebase and currently not fully covered by tests
    function calculateGrade(score) {
        if (score >= 90) {
          return 'A';
        } else if (score >= 80) {
          return 'B';
        } else if (score >= 70) {
          return 'C';
        } else if (score >= 60) {
          return 'D';
        } else {
          return 'F';
        }
      }
      
      // Write tests to cover different branches of the calculateGrade function
      test('calculateGrade returns correct grade for different scores', () => {
        expect(calculateGrade(95)).toBe('A');
        expect(calculateGrade(85)).toBe('B');
        expect(calculateGrade(75)).toBe('C');
        expect(calculateGrade(65)).toBe('D');
        expect(calculateGrade(55)).toBe('F');
      });
      
      // Write tests to cover edge cases and boundary conditions
      test('calculateGrade returns correct grade for edge cases', () => {
        expect(calculateGrade(100)).toBe('A');
        expect(calculateGrade(89)).toBe('B');
        expect(calculateGrade(70)).toBe('C');
        expect(calculateGrade(60)).toBe('D');
        expect(calculateGrade(0)).toBe('F');
      });
      
      // Write tests to cover error handling logic (if any)
      test('calculateGrade throws error for invalid input', () => {
        expect(() => {
          calculateGrade('invalid');
        }).toThrow('Invalid input');
      });
      
      // Ensure that all public functions are tested
      test('all public functions are tested', () => {
        expect(typeof calculateGrade).toBe('function');
        // Add similar assertions for other public functions in your codebase
      });
      
      test('boss attack decreases character health', () => {
        const { getByTestId } = render(<ChallengeArea level={5} WolfCoinReward={() => {}} CatCoinReward={() => {}} />);
        fireEvent.keyDown(window, { key: 'ArrowRight' }); // Move character within boss range
        jest.advanceTimersByTime(1000); // Simulate time for boss attack interval
        const characterHealthBar = getByTestId('character-health').firstChild.style.width;
        expect(characterHealthBar).not.toBe('100%'); // Check if character health decreased
      });
      
      test('character defeats boss and receives reward', () => {
        const wolfCoinRewardMock = jest.fn();
        const { getByTestId } = render(<ChallengeArea level={5} WolfCoinReward={wolfCoinRewardMock} CatCoinReward={() => {}} />);
        fireEvent.keyDown(window, { key: '9' }); // Simulate attack to defeat boss
        expect(wolfCoinRewardMock).toHaveBeenCalled(); // Check if reward function was called
      });
    
      test('character movement within game boundaries', () => {
        const { getByTestId } = render(<ChallengeArea level={1} WolfCoinReward={() => {}} CatCoinReward={() => {}} />);
        fireEvent.keyDown(window, { key: 'ArrowRight' }); // Move character to the right
        let characterPosition = getByTestId('character').style.left;
        expect(parseInt(characterPosition)).toBeLessThanOrEqual(100); // Assuming game boundary is 100%
        
        fireEvent.keyDown(window, { key: 'ArrowLeft' }); // Move character to the left
        characterPosition = getByTestId('character').style.left;
        expect(parseInt(characterPosition)).toBeGreaterThanOrEqual(0); // Assuming game boundary is 0%
      });
    
      test('magic attack mode toggles and magic attack decreases boss health', () => {
        const { getByTestId, getByText } = render(<ChallengeArea level={10} WolfCoinReward={() => {}} CatCoinReward={() => {}} />);
        fireEvent.keyDown(window, { key: '0' }); // Toggle magic attack
        expect(getByText('Magic Mode Activated')).toBeInTheDocument(); // Check if magic mode is activated
        
        fireEvent.click(window); // Simulate magic attack
        const bossHealthBar = getByTestId('boss-health').firstChild.style.width;
        expect(bossHealthBar).not.toBe('100%'); // Check if boss health decreased
      });
      
      test('should decrease attempt count when challenge starts', async () => {
        const mockWolfCoinReward = jest.fn();
        const mockCatCoinReward = jest.fn();
    
        const { getByText, getByAltText } = render(
          <ChallengeArea level={5} WolfCoinReward={mockWolfCoinReward} CatCoinReward={mockCatCoinReward} />
        );
    
        // 模拟选中Boss
        act(() => {
          fireEvent.click(getByAltText('wolf-icon.png')); // 假设这是选择boss的按钮
        });
    
        // 模拟开始挑战按钮点击
        await act(async () => {
          fireEvent.click(getByText('START'));
        });
    
        // 检查尝试次数是否减少（需要在组件中暴露出尝试次数的状态或通过某种方式检测，这里只是示例）
        // 这里的检查方式取决于尝试次数如何在UI上展示。如果是通过文本显示，可以像下面这样检查：
        expect(getByText('Challenge Attempts 0/1')).toBeInTheDocument();
      });
      
      // 测试在选择不同Boss时，Boss的初始状态是否正确设置
test('boss state updates correctly on boss selection', () => {
    // 这里需要模拟根据选择的Boss更新状态的逻辑
    const { getByText } = render(<ChallengeArea level={10} />); // 假设用户等级允许挑战cat
  
    // 选择cat作为Boss
    fireEvent.click(getByText('Select Cat Boss'));
  
    // 检查是否显示了cat Boss的相关信息，比如健康值
    expect(getByText('Boss Health: 100')).toBeInTheDocument(); // 假设初始健康值为100
  });

// 测试挑战可用性
test('challenge availability updates correctly based on attempts', () => {
    // 假设挑战次数用完了
    const attemptsUsedUpState = { wolf: { count: 0, date: new Date().toDateString() } };
  
    // 检查挑战是否不可用
    expect(isChallengeAvailable('wolf', attemptsUsedUpState)).toBe(false); // 假设isChallengeAvailable是用来检查可用性的函数
  });


  describe('Boss selection and challenge initiation', () => {
  beforeEach(() => {
    // Mock localStorage for challenge attempts
    Storage.prototype.getItem = jest.fn((key) => {
      if (key === 'challengeAttempts') return JSON.stringify({ wolf: { count: 1, date: new Date().toDateString() }, cat: { count: 1, date: new Date().toDateString() }});
      return null;
    });
    Storage.prototype.setItem = jest.fn();
  });

  test('Boss selection is based on player level', () => {
    const { getByText, queryByAltText } = render(<ChallengeArea level={4} WolfCoinReward={() => {}} CatCoinReward={() => {}} />);

    // At level 4, wolf boss should be locked
    expect(queryByAltText('wolf-icon.png')).toBeNull();
    // Cat boss should not be visible
    expect(queryByAltText('cat-icon.png')).toBeNull();

    // Increase level to 5, wolf boss should be selectable
    rerender(<ChallengeArea level={5} WolfCoinReward={() => {}} CatCoinReward={() => {}} />);
    expect(getByText('LEVEL 5  WOLF')).not.toBeDisabled();

    // Increase level to 10, both bosses should be selectable
    rerender(<ChallengeArea level={10} WolfCoinReward={() => {}} CatCoinReward={() => {}} />);
    expect(getByText('LEVEL 10  CAT')).not.toBeDisabled();
  });

  test('Start challenge button is disabled based on daily limit', () => {
    // Assume the player has reached daily limit for wolf boss
    Storage.prototype.getItem = jest.fn(() => JSON.stringify({ wolf: { count: 0, date: new Date().toDateString() }, cat: { count: 1, date: new Date().toDateString() }}));
    
    const { getByText } = render(<ChallengeArea level={5} WolfCoinReward={() => {}} CatCoinReward={() => {}} />);
    fireEvent.click(getByText('LEVEL 5  WOLF'));

    // Start button for wolf boss should be disabled
    expect(getByText('START')).toBeDisabled();
    
    // Display notice for reaching daily limit
    expect(getByText(/You have reached your daily challenge limit/)).toBeInTheDocument();
  });

  test('Notices for unlocking bosses are based on player level', () => {
    const { getByText, rerender } = render(<ChallengeArea level={4} WolfCoinReward={() => {}} CatCoinReward={() => {}} />);
    
    // Notice for wolf boss should be visible
    expect(getByText(/Reach level 5 to unlock Boss - Wolf/)).toBeInTheDocument();
    
    rerender(<ChallengeArea level={9} WolfCoinReward={() => {}} CatCoinReward={() => {}} />);
    // Notice for cat boss should be visible
    expect(getByText(/Reach level 10 to unlock Boss - Cat/)).toBeInTheDocument();
  });
  
  test('Challenge button becomes enabled when boss is selectable and attempts are available', () => {
    // Player is level 5 and has not reached daily limit
    Storage.prototype.getItem = jest.fn(() => JSON.stringify({ wolf: { count: 1, date: new Date().toDateString() }}));
    
    const { getByText } = render(<ChallengeArea level={5} WolfCoinReward={() => {}} CatCoinReward={() => {}} />);
    fireEvent.click(getByText('LEVEL 5  WOLF'));

    // Start challenge button should be enabled for wolf
    expect(getByText('START')).not.toBeDisabled();
  });

  test('Challenge Start Logic', async () => {
    const mockLocalStorage = {};
    const mockWolfCoinReward = jest.fn();
    const mockCatCoinReward = jest.fn();
    // Mock local storage getItem and setItem
    jest.spyOn(window.localStorage.__proto__, 'getItem').mockImplementation((key) => {
      return JSON.stringify(mockLocalStorage[key]);
    });
    jest.spyOn(window.localStorage.__proto__, 'setItem').mockImplementation((key, value) => {
      mockLocalStorage[key] = value;
    });
    // Render component
    const { getByText, getByAltText } = render(
      <ChallengeArea level={5} WolfCoinReward={mockWolfCoinReward} CatCoinReward={mockCatCoinReward} />
    );
    // Assert initial render
    expect(getByText('Challenge Attempts 1/1')).toBeInTheDocument();
    expect(getByText('Level 5')).toBeInTheDocument();
    expect(getByText('START')).toBeDisabled();
    expect(getByAltText('WOLF')).toBeInTheDocument();
    // Start challenge
    fireEvent.click(getByText('START'));
    // Assert challenge starts
    await act(async () => {
      // Update state
      await Promise.resolve();
    });
    expect(mockWolfCoinReward).toHaveBeenCalled(); // Check if reward function is called
    expect(getByText('Challenge Attempts 0/1')).toBeInTheDocument(); // Check if attempts are updated
    expect(getByText('You have reached your daily challenge limit. Please try again tomorrow at 8 am.')).toBeInTheDocument(); // Check if limit notice is shown
    expect(getByText('START')).toBeDisabled(); // Check if start button is disabled
  });

  test('Challenge Start Logic - Cat Boss', async () => {
    const mockLocalStorage = {};
    const mockWolfCoinReward = jest.fn();
    const mockCatCoinReward = jest.fn();
    // Mock local storage getItem and setItem
    jest.spyOn(window.localStorage.__proto__, 'getItem').mockImplementation((key) => {
      return JSON.stringify(mockLocalStorage[key]);
    });
    jest.spyOn(window.localStorage.__proto__, 'setItem').mockImplementation((key, value) => {
      mockLocalStorage[key] = value;
    });
    // Render component
    const { getByText, getByAltText } = render(
      <ChallengeArea level={10} WolfCoinReward={mockWolfCoinReward} CatCoinReward={mockCatCoinReward} />
    );
    // Assert initial render
    expect(getByText('Challenge Attempts 1/1')).toBeInTheDocument();
    expect(getByText('Level 10')).toBeInTheDocument();
    expect(getByText('START')).toBeDisabled();
    expect(getByAltText('CAT')).toBeInTheDocument();
    // Start challenge
    fireEvent.click(getByText('START'));
    // Assert challenge starts
    await act(async () => {
      // Update state
      await Promise.resolve();
    });
    expect(mockCatCoinReward).toHaveBeenCalled(); // Check if reward function is called
    expect(getByText('Challenge Attempts 0/1')).toBeInTheDocument(); // Check if attempts are updated
    expect(getByText('You have reached your daily challenge limit. Please try again tomorrow at 8 am.')).toBeInTheDocument(); // Check if limit notice is shown
    expect(getByText('START')).toBeDisabled(); // Check if start button is disabled
  });

  test('Refresh Challenge Attempts', async () => {
    const { getByText } = render(
      <ChallengeArea level={10} WolfCoinReward={() => {}} CatCoinReward={() => {}} />
    );
    // Assert initial render
    expect(getByText('Challenge Attempts 1/1')).toBeInTheDocument();
    // Await until the reset time
    jest.advanceTimersByTime(1000 * 60 * 60 * 24);
    // Check if attempts are reset
    await act(async () => {
      // Update state
      await Promise.resolve();
    });
    expect(getByText('Challenge Attempts 1/1')).toBeInTheDocument(); // Check if attempts are reset to 1
  });

});

});



