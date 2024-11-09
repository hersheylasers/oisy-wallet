import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock environment variables
vi.mock('$env/dynamic/public', () => ({
	PUBLIC_DFX_NETWORK: 'local',
	PUBLIC_CANISTER_ID_INTERNET_IDENTITY: 'rdmx6-jaaaa-aaaaa-aaadq-cai',
	PUBLIC_CANISTER_ID_WALLET: 'ryjl3-tyaaa-aaaaa-aaaba-cai'
}));

// Mock the auth client
vi.mock('@dfinity/auth-client', () => ({
	AuthClient: {
		create: vi.fn().mockResolvedValue({
			isAuthenticated: vi.fn().mockResolvedValue(false),
			login: vi.fn(),
			logout: vi.fn(),
			getIdentity: vi.fn()
		})
	}
}));

// Mock the agent
vi.mock('@dfinity/agent', () => ({
	Actor: {
		createActor: vi.fn()
	},
	HttpAgent: vi.fn()
}));
