describe('jest is working properly', () => {
    test('should pass', () => {
        function sum(a, b) {
            return a + b;
        }

        expect(sum(3, 3)).toEqual(6);
    });
});
