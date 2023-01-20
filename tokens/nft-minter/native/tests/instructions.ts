import * as borsh from "borsh";


class Assignable {
    constructor(properties) {
        Object.keys(properties).map((key) => {
            return (this[key] = properties[key]);
        });
    };
};

export enum NftMinterInstruction {
    Create,
    Mint,
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
                ['nft_title', 'string'],
                ['nft_symbol', 'string'],
                ['nft_uri', 'string'],
            ]
        }
    ]
]);

export class MintToArgs extends Assignable {
    toBuffer() {
        return Buffer.from(borsh.serialize(MintToArgsSchema, this));
    }
};
const MintToArgsSchema = new Map([
    [
        MintToArgs, {
            kind: 'struct',
            fields: [
                ['instruction', 'u8'],
            ]
        }
    ]
]);