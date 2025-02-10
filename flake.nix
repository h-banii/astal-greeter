{
  inputs = {
    ags = {
      url = "github:aylur/ags";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs =
    {
      nixpkgs,
      ags,
      ...
    }:
    let
      system = "x86_64-linux";
      pkgs = import nixpkgs { inherit system; };
      extraPackages = with ags.inputs.astal.packages.${system}; [
        greet
      ];
    in
    {
      devShells.${system}.default = pkgs.mkShell {
        buildInputs = with pkgs; [
          (ags.packages.${system}.default.override {
            inherit extraPackages;
          })
          nodejs
          nodePackages.npm
          gtk4
        ];
        shellHook = ''
          export AGS_DIR=''$PWD
          run() {
            ags run "''${AGS_DIR}/src/app.ts" --gtk4
          }
        '';
      };

      packages.${system}.default = ags.lib.bundle {
        inherit pkgs;
        inherit extraPackages;
        src = ./.;
        name = "h-banii.ags-shell";
        entry = "src/app.ts";
        gtk4 = true;
      };
    };
}
