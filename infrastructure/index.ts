import { exec as execCB, spawn } from "child_process";
import { readFileSync } from "fs";
import inquirer from "inquirer";
import { Client } from "ssh2";
import { promisify } from "util";

const exec = promisify(execCB);

const commandList = [
  "terraform apply",
  "terraform apply --auto-approve",
  "terraform validate",
  "terraform destroy",
  "terraform destroy --auto-approve",
  "get key",
  "connect to instance",
] as const;

type CommandList = typeof commandList[number];

export const main = async () => {
  const res: { command: CommandList } = await inquirer.prompt([
    {
      name: "command",
      message: "What do no?",
      type: "list",
      loop: true,
      choices: commandList.map((command) => {
        return { name: command };
      }),
    },
  ]);

  if (res.command === "terraform apply") {
  }

  if (res.command === "terraform apply --auto-approve") {
    return executeCommand(res.command);
  }

  if (res.command === "terraform validate") {
    return executeCommand(res.command);
  }

  if (res.command === "get key") {
    return executeCommand("terraform output -raw private_key > key.pem");
  }

  if (res.command === "terraform destroy --auto-approve") {
    return executeCommand(res.command);
  }

  if (res.command === "connect to instance") {
    // const publicDns = await executeCommand("get public dns");

    // console.log(publicDns);

    const conn = new Client();

    conn
      .on("ready", () => {
        console.log("Client :: ready");

        conn.shell((err, stream) => {
          if (err) throw err;

          stream
            .on("close", () => {
              console.log("Stream :: close");
              conn.end();
            })
            .on("data", (data) => {
              console.log("OUTPUT: " + data);
            })
            .on("exit", (d) => {
              console.log(d);
            });
          stream.end("ls -l\nexit\n");
        });
      })
      .connect({
        host: "ec2-107-23-15-65.compute-1.amazonaws.com",
        port: 22,
        username: "ubuntu",
        privateKey: readFileSync("./key.pem"),
        debug: (s) => {
          console.log(s);
        },
      });

    // const connectionString = `ubuntu@${publicDns?.trim()}`;

    // await executeCommand(`ssh -i key.pem -tt ${connectionString.trim()}`);

    // return;
  }
};

main();

const executeCommand = async (command: string) => {
  if (command === "get public dns") {
    const { stdout } = await exec("terraform output -raw public_dns");

    return stdout;
  }

  const ls = spawn(command, { shell: true });

  ls.stdout.on("data", (data) => {
    console.log(`stdout: ${data.toString().trim()}`);
  });

  ls.stderr.on("data", (data) => {
    console.log("stderr: " + data.toString().trim());
  });

  ls.on("exit", function (code) {
    console.log(
      code === 0 || !!code
        ? `Child process exited with code ${code}.`
        : "Child process exited with no code."
    );

    main();
  });
};
