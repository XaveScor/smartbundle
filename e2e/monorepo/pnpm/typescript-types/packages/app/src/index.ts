import { createUser, VERSION } from '@test/utils';
import type { User } from '@test/utils';
import { add, subtract } from '@test/utils/math';
import type { MathOperation } from '@test/utils/math';

// Test that types are properly resolved
const user: User = createUser('John Doe', 'john@example.com');
console.log('Created user:', user);
console.log('Version:', VERSION);

// Test math operations
const sum: number = add(5, 3);
const diff: number = subtract(10, 4);
const operation: MathOperation = 'add';

console.log(`Sum: ${sum}, Difference: ${diff}, Operation: ${operation}`);

// This should cause a type error if types aren't resolved correctly
// const invalidUser: User = { name: 'Invalid' }; // Missing required fields