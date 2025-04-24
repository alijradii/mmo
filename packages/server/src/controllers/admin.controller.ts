import itemModel, { Item} from "../database/models/item.model";

export const getAllItems = async () => {
  try {
    const items: Item[] = await itemModel.find({});
    console.log("Found " + items.length + " items");
    return {
      success: true,
      data: items,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to retrieve items",
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

export const addOrUpdateItem = async (itemData: Item) => {
  try {
    const updatedItem = await itemModel.findOneAndUpdate(
      { _id: itemData._id },
      itemData,
      { upsert: true, new: true }
    );

    console.log(`Item ${updatedItem.name} has been added/updated.`);
    return {
      success: true,
      data: updatedItem,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to add or update item",
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

export const deleteItem = async (itemData: Item) => {
  try {
    const result = await itemModel.deleteOne({ _id: itemData._id });

    return {
      success: true,
      deletedCount: result.deletedCount,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to delete item",
      error: error instanceof Error ? error.message : String(error),
    };
  }
};