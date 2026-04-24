/**
 * Generate a placeholder image URL with the product name
 * @param {string} itemName - The name of the item for the placeholder
 * @returns {string} A styled placeholder image URL
 */
function getPlaceholderImage(itemName) {
  const encodedName = encodeURIComponent(itemName.substring(0, 35));
  const placeholderUrl = `https://placehold.co/800x800/E7CDCE/C00645?text=${encodedName}`;
  console.log(`[Placeholder] Using placeholder for: "${itemName}"`);
  return placeholderUrl;
}

module.exports = { getPlaceholderImage };
