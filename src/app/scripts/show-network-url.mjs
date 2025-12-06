import os from "os";
const interfaces = os.networkInterfaces();

process.stdin.on("data", (data) => {
  process.stdout.write(data);

  const output = data.toString().trim();
  if (output.includes("- Network:")) {
    const addresses = [];
    Object.values(interfaces).forEach((iface) => {
      iface.forEach((addr) => {
        if (addr.family === "IPv4" && !addr.internal) {
          addresses.push(addr.address);
        }
      });
    });

    if (addresses.length > 0) {
      console.log(`Network URL: http://${addresses[0]}:3000`);
      addresses.forEach((address) => {
        console.log(`http://${address}:3000`);
      });
    }
  }
});
