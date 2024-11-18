import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterOutlet} from '@angular/router';
import {createDockerDesktopClient} from "@docker/extension-api-client";

import {
  checkK8sConnection,
  primeCluster,
  getToken,
  portForward,
  deprimeCluster,
} from "./helper/kubernetes";

import {
  listHelmReleases,
  installKubernetesDashboardChart,
  uninstallKubernetesDashboardChart,
} from "./helper/helm";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private _output: string | undefined;
  private ddClient = createDockerDesktopClient();

  constructor() {
    this._output = "";
  }

  async checkK8sConnection() {
    this.output = await checkK8sConnection(this.ddClient);
  }

  async listHelmReleases() {
    this.output = await listHelmReleases(this.ddClient);
  }

  async primeCluster() {
    this.output = await primeCluster(this.ddClient);
  }

  async installKubernetesDashboardChart() {
    this.output = await installKubernetesDashboardChart(this.ddClient);
  }

  async portForward() {
    this.output = await portForward(this.ddClient);
  }

  async getToken() {
    this.output = await getToken(this.ddClient);
    navigator.clipboard.writeText(this.output);
  }

  loadKubernetesDashboard() {
    window.location.href = "http://localhost:3000";
  }

  async uninstallKubernetesDashboardChart() {
    this.output = await uninstallKubernetesDashboardChart(this.ddClient);
  }

  async deprimeCluster() {
    this.output = await deprimeCluster(this.ddClient);
  }

  set output(commandOutput: string | undefined) {
    this._output = commandOutput;
  }

  get output() {
    return this._output;
  }

}
