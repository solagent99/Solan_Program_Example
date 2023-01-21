import * as borsh from "borsh";


class Assignable {
    constructor(properties) {
        Object.keys(properties).map((key) => {
            return (this[key] = properties[key]);
        });
    };
};

export enum MyInstruction {
    Create,
    MintNft,
    MintSpl,
    TransferTokens,
}

export class CreateTokenArgs extends Assignable {
    toBuffer() {
        return Buffer.from(borsh.serialize(CreateTokenArgsSchema, this));
    }
};
const CreateTokenArgsSchema = new Map([
    [
        CreateTokenArgs, {
            kind: 'struct',
            fields: [
                ['instruction', 'u8'],
                ['token_title', 'string'],
                ['token_symbol', 'string'],
                ['token_uri', 'string'],
                ['decimals', 'u8'],
            ]
        }
    ]
]);

export class MintNftArgs extends Assignable {
    toBuffer() {
        return Buffer.from(borsh.serialize(MintNftArgsSchema, this));
    }
};
const MintNftArgsSchema = new Map([
    [
        MintNftArgs, {
            kind: 'struct',
            fields: [
                ['instruction', 'u8'],
            ]
        }
    ]
]);

export class MintSplArgs extends Assignable {
    toBuffer() {
        return Buffer.from(borsh.serialize(MintSplArgsSchema, this));
    }
};
const MintSplArgsSchema = new Map([
    [
        MintSplArgs, {
            kind: 'struct',
            fields: [
                ['instruction', 'u8'],
                ['quantity', 'u64'],
            ]
        }
    ]
]);

export class TransferTokensArgs extends Assignable {
    toBuffer() {
        return Buffer.from(borsh.serialize(TransferTokensArgsSchema, this));
    }
};
const TransferTokensArgsSchema = new Map([
    [
        TransferTokensArgs, {
            kind: 'struct',
            fields: [
                ['instruction', 'u8'],
                ['quantity', 'u64'],
            ]
        }
    ]
]);