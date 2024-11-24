import {AfterViewInit, Component, inject} from '@angular/core';
import {DOCUMENT} from '@angular/common';
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
export class AppComponent implements AfterViewInit{
  private _output: string | undefined;
  private ddClient = createDockerDesktopClient();
  private readonly document = inject(DOCUMENT);
  private readonly window = this.document?.defaultView

  constructor() {
    this._output = "";
  }

  ngAfterViewInit(): void {
    if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      this.document.querySelector('html')?.classList.remove('dark')
    } else {
      this.document.querySelector('html')?.classList.add('dark')
    }
  }

  async allSteps() {
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
    this.window?.navigator?.clipboard?.writeText(this.output);
  }

  loadKubernetesDashboard() {
    this.document.location.href = "http://localhost:3000/#/workloads?namespace=_all";
  }

  async allCleanSteps() {
  }

  async uninstallKubernetesDashboard() {
    this.output = await uninstallKubernetesDashboardChart(this.ddClient);
  }

  async deprimeCluster() {
    this.output = await deprimeCluster(this.ddClient);
  }

  async checkConnectionToCluster() {
    this.output = await checkK8sConnection(this.ddClient);
  }

  async listHelmReleases() {
    this.output = await listHelmReleases(this.ddClient);
  }

  set output(commandOutput: string | undefined) {
    this._output = commandOutput;
  }

  get output() {
    return this._output;
  }

}
