import React from "react";
import { GradientDots } from "@/components/ui/gradient-dots";

export default function DefaultDemo() {
  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden">
      <GradientDots duration={20} />
      <h1 className="text-6xl text-center font-extrabold z-10">Gradient Dots</h1>
    </main>
  );
}

