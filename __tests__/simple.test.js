describe('Simple Test Suite', () => {
    test('should pass a basic test', () => {
        expect(1 + 1).toBe(2);
    });

    test('should handle strings', () => {
        expect('hello').toBe('hello');
    });

    test('should check array length', () => {
        const array = [1, 2, 3];
        expect(array.length).toBe(3);
    });
}); 