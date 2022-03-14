import mongoose from 'mongoose';

export function collectionCreator(modelName = 'Collection') {
    const collectionSchema = mongoose.Schema({
        name: { type: String, required: true },
        createdBy: { type: String, required: true },
        totalPrice: { type: Number },
        items: [{ type: mongoose.Types.ObjectId, ref: 'Item' }],
        favourite: { type: Boolean },
        likes: { type: Number },
    });

    collectionSchema.set('toJSON', {
        transform: (document, returnedObject) => {
            delete returnedObject.__v;
            delete returnedObject.password;
        },
    });

    let Collection;
    if (mongoose.default.models[modelName]) {
        Collection = mongoose.model(modelName);
    } else {
        Collection = mongoose.model(modelName, collectionSchema);
    }
    return Collection;
}
export const CollectionModel = collectionCreator();
