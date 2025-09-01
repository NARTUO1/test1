import { VendorLayout } from "@/components/VendorLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";

export default function VendorReviews() {
  const reviews = [
    { id: 1, user: "Aarav", rating: 5, comment: "Great quality and fast shipping!", date: "2 days ago" },
    { id: 2, user: "Isha", rating: 4, comment: "Product as described. Will buy again.", date: "1 week ago" },
  ];

  return (
    <VendorLayout activeTab="reviews">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Reviews</h1>
          <p className="text-muted-foreground">See what customers say about your products.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((r) => (
            <Card key={r.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="font-medium">{r.user}</span>
                  <span className="flex items-center gap-1 text-yellow-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < r.rating ? "fill-yellow-500" : "text-muted-foreground"}`} />
                    ))}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-2">{r.comment}</p>
                <p className="text-xs text-muted-foreground">{r.date}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </VendorLayout>
  );
}
