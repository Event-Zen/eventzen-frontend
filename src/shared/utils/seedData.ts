import { listUsersAdmin } from "../api/userClient";
import { vendorApi } from "../api/vendorClient";
import { eventApi } from "../api/eventClient";

export async function seedSampleData() {
  try {
    // 1. Check if we already have some data (optional)
    const users = await listUsersAdmin();
    if (users.length > 5) return; // Already seeded

    // 2. Create a sample Vendor Service (Directly using axios instances to bypass type issues)
    await vendorApi.post("/", {
      serviceName: "Royal Catering Service",
      vendorName: "Alice Smith",
      vendorEmail: "alice@example.com",
      vendorPhone: "0771234567",
      category: "Catering",
      price: 150000,
      currency: "LKR",
      city: "Colombo",
      description: "Premium catering for weddings and corporate events."
    });

    await vendorApi.post("/", {
      serviceName: "Elite Photography",
      vendorName: "Bob Jones",
      vendorEmail: "bob@example.com",
      vendorPhone: "0779876543",
      category: "Photography",
      price: 85000,
      currency: "LKR",
      city: "Kandy",
      description: "Capturing your moments with high-end gear."
    });

    // 3. Create a sample Event
    await eventApi.post("/", {
      title: "Tech Conference 2026",
      description: "Annual gathering for tech enthusiasts.",
      startDateTime: new Date(Date.now() + 86400000 * 7), // 7 days from now
      endDateTime: new Date(Date.now() + 86400000 * 7 + 3600000 * 4),
      locationType: "physical",
      location: "BMICH Colombo",
      status: "published"
    });

    return true;
  } catch (error) {
    console.error("Seeding failed:", error);
    throw error;
  }
}
